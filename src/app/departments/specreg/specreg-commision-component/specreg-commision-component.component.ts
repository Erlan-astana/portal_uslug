import {ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar, MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {DirectoryService} from '../../../services/directory.service';
import {dic} from '../../../shared/models/dictionary.model';
import {FilesUploadComponent} from '../../../components/files-upload/files-upload.component';
import SpecReg = dic.SpecReg;
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-specreg-commision-component',
  templateUrl: './specreg-commision-component.component.html',
  styleUrls: ['./specreg-commision-component.component.scss']
})
export class SpecregCommisionComponentComponent implements OnInit, OnDestroy {
  @ViewChild(FilesUploadComponent, {static: false})
  public filesComponent: FilesUploadComponent;
  dataSource = new MatTableDataSource<SpecReg>();
  displayedColumns = ['select', 'position', 'lotStatus', 'lotNumber', 'PlotLocation', 'SpecialPurpose', 'SpecregDate'];
  selection = new SelectionModel<SpecReg>(true, []);
  specregNumberTypes = [{value: 'PRELIMINARY', name: 'Предварительный'},
    {value: 'APPROVED', name: 'Утвержденный'}];
  fileCategories: any[] = [
    {
      extensions: 'application/pdf',
      id: 555,
      required: true,
      subserviceId: null,
      title: ' Решение комиссии',
      titleRu: 'Решение комиссии',
      titleKk: 'Решение комиссии',
      type: 'SPECREG_COMMISSION',
      categoryFiles: [],
      categoryFilesUpload: []
    }
  ];
  decreeNumber: number = null;
  decreeDate: any;
  destroyed$ = new Subject();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SpecregCommisionComponentComponent>,
    private directorySvc: DirectoryService,
    private snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    if (this.data.specregId > 0) {
      this.getAuctionFiles();
    } else {
      this.getAuctionsWithoutDecree();
    }
  }

  getAuctionFiles() {
    this.directorySvc.getSpecregCommisionFiles(this.data.specregId)
    .pipe(takeUntil(this.destroyed$))
    .subscribe(res => {
      if (res.length > 0) {
        this.fileCategories[0].categoryFiles = res;
        this.decreeDate = new Date(res[0].commissionDate);
        this.decreeNumber = res[0].commissionNumber;
      }
    });
  }

  getAuctionsWithoutDecree() {
    this.directorySvc.getSpecregPreliminaries()
    .pipe(takeUntil(this.destroyed$))
    .subscribe(res => {
      this.dataSource = new MatTableDataSource(res);
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row =>
        this.selection.select(row)
      );
  }

  getAuctionLandStatusStr(num) {
    const type = this.specregNumberTypes.find(item => item.value === num);
    return type.name;
  }

  sendFilesAndAuctions() {
    const specregListId = this.selection.selected.map(auction => auction.id);

    if (this.data.specregId) {
      specregListId.push(this.data.specregId);
    }

    const body: any = {
      specregIds: specregListId,
      files: this.filesComponent.fileCategories[0].categoryFiles,
      commissionNumber: this.decreeNumber,
      commissionDate: new Date(this.decreeDate).toJSON()
    };

    this.saveDecree(body);
  }

  saveDecree(body) {
    this.directorySvc.saveSpecregCommision(body).subscribe(res => {
      this.snackBar.open('Решение комиссии добавлен успешно!', '', {duration: 3000});
      this.close();
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  removeFile(fileData) {
    this.directorySvc.removeSpecregFile(this.data.specregId, fileData.id)
    .pipe(takeUntil(this.destroyed$))
    .subscribe(res => {
      this.snackBar.open('Файл успешно удален!', '', {duration: 3000});
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}

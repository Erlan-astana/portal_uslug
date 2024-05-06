import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar, MatTableDataSource} from '@angular/material';
import {dic} from '../../../shared/models/dictionary.model';
import SpecReg = dic.SpecReg;
import {SpecregStatus} from '../../../shared/utils/constants';
import {takeUntil} from 'rxjs/operators';
import {DirectoryService} from '../../../services/directory.service';
import {Subject} from 'rxjs';
import {FilesUploadComponent} from '../../../components/files-upload/files-upload.component';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-specreg-exclude',
  templateUrl: './specreg-exclude.component.html',
  styleUrls: ['./specreg-exclude.component.scss']
})
export class SpecregExcludeComponent implements OnInit, OnDestroy {
  @ViewChild(FilesUploadComponent, {static: false})
  public filesComponent: FilesUploadComponent;
  dataSource: SpecReg[] = [];
  statusList = SpecregStatus;
  displayedColumns: string[] = ['position', 'id', 'SpecRegNumber', 'fio', 'iin', 'regAddressRu', 'factAddress',
    'phone', 'SpecregSourceType', 'status', 'SpecregNumberType'];
  destroyed$ = new Subject();
  exludedDisplayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  excludedDataSource: any;
  excludeSpecregsBtn: boolean;
  sectionId: string = '9';
  selectedStatus = 'RECEIVED';

  fileCategories: any[] = [
    {
      extensions: 'application/pdf',
      id: 555,
      required: true,
      subserviceId: null,
      title: 'Основание для исключения',
      titleRu: 'Основание для исключения',
      titleKk: 'Шеттетудің негізі',
      type: 'SPECREG_EXCLUSION',
      categoryFiles: [],
      categoryFilesUpload: []
    }
  ];

  constructor(public dialogRef: MatDialogRef<SpecregExcludeComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public directorySvc: DirectoryService,
              private snackBar: MatSnackBar,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.dataSource = this.data.specregList;
    this.excludeSpecregsBtn = this.data.specregList.length > 0 && !this.data.showSpecregExcluded;
    this.getPreviouslyExcluded();
    if (this.data.reasonDetails) {
      this.showExcludedSpecregData(this.data);
    }
  }

  getPreviouslyExcluded() {
    if (this.data.showSpecregExcluded && this.authService.currentOurUser) {
      this.directorySvc.excludedSpecregs(this.authService.currentOurUser.regionId)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(res => {
          this.excludedDataSource = res.content.filter(specreg => specreg.lastExcludedSpecregSum > 0);
        });
    }
  }

  getStatusStr(text) {
    if (text) {
      const status = this.statusList.find(item => text === item.id);
      return status.name;
    }
  }

  excludeSpecregs() {
    const uploadFileLength = this.filesComponent.fileCategories[0].categoryFiles.length;
    if (uploadFileLength > 0 && uploadFileLength >= this.data.specregList.length) {
      const specregListId = this.data.specregList.map(specreg => specreg.id);
      const data: any = {
        ids: specregListId,
        status: this.selectedStatus,
        uid: this.filesComponent.fileCategories[0].categoryFiles[0].objectId,
        fileName: this.filesComponent.fileCategories[0].categoryFiles[0].name
      };
      this.directorySvc.excludeSpecregs(data)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(res => {
          console.log(res);
          if (res.status === 200) {
            this.snackBar.open('Успешно!', '', {duration: 3000});
            this.close(true);
          }
        });
    } else {
      let errorMessage = 'Файл не загружен!';
      if (uploadFileLength > 0) {
        errorMessage = 'Недостаточное количество прикрепленных файлов';
      }
      this.snackBar.open(errorMessage, '', {duration: 3000});
    }
  }

  showExcludedSpecregData(data) {
    const filterDefaultValue = [{key: 'reasonFileUid', operation: 'MATCH', value: data.reasonDetails}];
    this.directorySvc.getSpecregs(0, 100, filterDefaultValue).pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        this.dataSource = res.body.content;
        this.data.showSpecregExcluded = false;
        this.excludeSpecregsBtn = false;
        this.data.reasonDetails = data.reasonDetails;
        this.fileCategories[0].categoryFiles.push({
          objectId: data.reasonDetails,
          name: res.body.content[0].reasonFileName
        });
        this.sectionId = '11';
      });
  }

  close(val = false) {
    this.dialogRef.close(val);
  }

  rollbackSpecreg() {
    if (this.data.reasonDetails) {
      this.directorySvc.rollbackSpecreg(this.dataSource[0].id)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(res => {
          this.snackBar.open('Успешно!', '', {duration: 3000});
        }, error => {
          this.snackBar.open(`Ошибка ! ${error.error.message}`, '', {duration: 3000});
        });
    }
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

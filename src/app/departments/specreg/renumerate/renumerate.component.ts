import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DynamicFormComponent} from '../../../components/dynamic-form/dynamic-form.component';
import {DirectoryService} from '../../../services/directory.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {DatePipe} from '@angular/common';
import {SpecregJournalStatus, SpecregStatus} from "../../../shared/utils/constants";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-renumerate',
  templateUrl: './renumerate.component.html',
  styleUrls: ['./renumerate.component.scss']
})
export class RenumerateComponent implements OnInit, OnDestroy {
  destroyed$ = new Subject();
  @ViewChild(DynamicFormComponent, {static: false})
  public formComponent: DynamicFormComponent;
  formFields = [
    {key: 'lastRenumerateDate', type: 'string', required: false, controlType: 'date', label: 'lastRenumerateDate'},
    {key: 'excludedSpecregSum', type: 'number', required: false, controlType: 'number', label: 'excludedSpecregSum'},
  ];
  specregHistory: any = null;
  displayedColumns: string[] = ['name', 'weight', 'symbol'];
  dataSource = [{name: 'specregDate'}, {name: 'specregNumber'}, {name: 'FIO'}, {name: 'iin'}, {name: 'regAddressRu'},
    {name: 'factAddressRu'}, {name: 'phone'}, {name: 'specregSourceType'}, {name: 'specregStatus'}, {name: 'orderNumber'}];
  statusJournalList = SpecregJournalStatus;
  statusSpecregList = SpecregStatus;
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

  constructor(public dialogRef: MatDialogRef<RenumerateComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private directorySvc: DirectoryService,
              public authService: AuthService) {
  }

  ngOnInit() {
    this.getRenumerateHistory();
    if (this.data) {
      this.data.specreg.specregData.exFIO = `${this.data.specreg.specregData.exSecondName || ''} 
      ${this.data.specreg.specregData.exFirstName || ''}`;
      this.data.specreg.specregData.toFIO = `${this.data.specreg.specregData.toSecondName} ${this.data.specreg.specregData.toFirstName}`;
      this.data.specreg.specregData.exSpecregStatus =
        this.getSpecregStatusStr(this.data.specreg.specregData.exSpecregStatus, this.statusSpecregList);
      this.data.specreg.specregData.toSpecregStatus =
        this.getSpecregStatusStr(this.data.specreg.specregData.toSpecregStatus, this.statusSpecregList);

      this.fileCategories[0].categoryFiles.push({
        objectId: this.data.specreg.specregData.toReasonFileUid,
        name: this.data.specreg.specregData.toReasonFileName
      });
    }
  }

  getRenumerateHistory() {
    if (this.authService.currentOurUser) {
      this.directorySvc.specregRenumerateHistory(this.authService.currentOurUser.regionId)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(res => {
          this.specregHistory = res.body;
        });
    }
  }

  onOkClick(val): void {
    this.dialogRef.close(val);
  }

  capitalizeFirstLetter(str) {
    if (str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  }

  getSpecregStatusStr(text, list) {
    if (text) {
      const status = list.find(item => text === item.id);
      return status.name;
    }
  }

  getSpecregColumnByNames(pre, name: string) {
    if (name.includes('Date')) {
      const datePipe = new DatePipe('en-US');
      const res = datePipe.transform(this.data.specreg.specregData[pre + this.capitalizeFirstLetter(name)], 'dd.MM.yyyy HH:mm');
      return res;
    }
    return this.data.specreg.specregData[pre + this.capitalizeFirstLetter(name)];
  }

  removeFile(fileData) {
    this.directorySvc.removeSpecregFile(this.data.specregId, fileData.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        //this.snackBar.open('Файл успешно удален!', '', {duration: 3000});
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}

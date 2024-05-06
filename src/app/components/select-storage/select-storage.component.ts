import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SignService } from 'src/app/services/sign.service';

@Component({
  selector: 'app-select-storage',
  templateUrl: './select-storage.component.html',
  styleUrls: ['./select-storage.component.scss']
})
export class SelectStorageComponent implements OnInit {

  sign;
  selectedStorageForm: FormGroup;
  selectStorages = ['PKCS12'];
  objectData = {
    value: '',
    isSelectStorage: false
  };
  activeTokenBtn: boolean = false;
  currentLang;
  destroyed$ = new Subject();

  constructor(
    public signSvc: SignService,
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<SelectStorageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    public translate: TranslateService,
  ) { 
    this.currentLang = this.translate.currentLang ? this.translate.currentLang : this.translate.getDefaultLang();
  }

  ngOnInit() {
    this.translate.onLangChange.pipe(takeUntil(this.destroyed$)).subscribe((event: any) => {
      this.currentLang = event.lang;
    });

    this.sign = this.signSvc.sign$.subscribe((data: any) => {
      if (data.callback === `getActiveTokensBack`) {
        this.getActiveTokensBack(data.result);
      }
    });
    this.initForm();
  }

  initForm() {
    this.selectedStorageForm = this._fb.group({
      selectedStorage: ['',]
    });
  }

  getActiveTokensCall() {
    this.signSvc.getActiveTokens("getActiveTokensBack");
  }

  getActiveTokensBack(result) {

    const errorMessageRu = 'Нет хранилища';
    const errorMessageKk = 'Сақтау орны жоқ';
    const successMessageRu = 'Элемент добавлен';
    const successMessageKk = 'Элемент қосылды';
    
    if (result['code'] === "500") {
      alert(result['message']);
    }else if (result['code'] === "200") {
      if (result['responseObject'].length === 0) {
        this.currentLang === 'ru' ? this.openSnackBar(errorMessageRu) : this.openSnackBar(errorMessageKk);
      }else {
        var listOfTokens = result['responseObject'];
        for (var i = 0; i < listOfTokens.length; i++) {
          this.selectStorages.push(listOfTokens[i]);
        }
        this.activeTokenBtn = true;
      }
    }

    if (this.selectStorages.length > 1) {
      this.currentLang === 'ru' ? this.openSnackBar(successMessageRu) : this.openSnackBar(successMessageKk);
    }
  }

  onOkClick(value: string) {
    if (value === null || value === 'null' || value === '' || value.length === 0) {
      this.dialogRef.close(this.objectData);
    }else {
      this.objectData.value = value;
      this.objectData.isSelectStorage = true;
      this.dialogRef.close(this.objectData);
    }
  }

  openSnackBar(message: string, action?: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  
}

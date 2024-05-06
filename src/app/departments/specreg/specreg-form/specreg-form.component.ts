import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {FileService} from '../../../services/file.service';
import {TranslateService} from '@ngx-translate/core';
import {dic} from '../../../shared/models/dictionary.model';
import {DirectoryService} from '../../../services/directory.service';
import {DynamicFormComponent} from '../../../components/dynamic-form/dynamic-form.component';
import {MatSnackBar} from '@angular/material';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import SpecReg = dic.SpecReg;
import {SelectRegionComponent} from "../../../components/select-region/select-region.component";

@Component({
  selector: 'app-specreg-form',
  templateUrl: './specreg-form.component.html',
  styleUrls: ['./specreg-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SpecregFormComponent implements OnInit, OnDestroy, AfterViewChecked {
  formFields = [
    {key: 'id', type: 'number', required: false},
    {
      key: 'specregNumber',
      type: 'number',
      required: false,
      controlType: 'number',
      label: 'specregNumber',
      disabled: true
    },
    {key: 'orderNumber', type: 'number', required: false, controlType: 'number', label: 'orderNumber', disabled: true},
    {
      key: 'iin', type: 'string', required: true, controlType: 'textbox', label: 'iin', disabled: true,
      validators: [Validators.minLength(12), Validators.maxLength(12), Validators.required]
    },
    {key: 'secondName', type: 'string', required: false, controlType: 'textbox', label: 'LastName', disabled: true},
    {key: 'firstName', type: 'string', required: false, controlType: 'textbox', label: 'FirstName', disabled: true},
    {key: 'lastName', type: 'string', required: false, controlType: 'textbox', label: 'MiddleName', disabled: true},
    {key: 'regAddressRu', type: 'string', required: false, controlType: 'textbox', label: 'Address', disabled: true},
    {
      key: 'factAddressRu',
      type: 'string',
      required: false,
      controlType: 'textbox',
      label: 'FactAddress',
      disabled: true
    },
    {key: 'phone', type: 'number', required: false, controlType: 'number', label: 'PhoneNumber', disabled: true},
    {key: 'regionId', required: false},
    {key: 'specregDate', type: 'string', required: false, controlType: 'date', label: 'SpecregDate', disabled: true},
    /* {
       key: 'specregSourceType', type: 'string', required: false, controlType: 'dropdown', label: 'SpecregSourceType',
       options: [{id: 'RGIS', name: 'Портал РГИС'}, {id: 'Operator', name: 'Оператор'}]
     },*/
  ];
  @ViewChild(DynamicFormComponent, {static: false})
  public formComponent: DynamicFormComponent;
  currentLang;
  specregId: number = null;
  specreg: SpecReg = null;
  destroyed$ = new Subject();
  @ViewChild(SelectRegionComponent, {static: false})
  public regionComponent: SelectRegionComponent;
  specregFormChanged = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private fileSvc: FileService,
    private translate: TranslateService,
    private directorySvc: DirectoryService,
    private snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.getQueryParams();
    this.getSpecreg();
    this.initTranslate();
  }

  initTranslate() {
    this.translate.onLangChange
      .pipe(takeUntil(this.destroyed$))
      .subscribe((event: any) => {
        this.currentLang = event.lang;
      });
  }

  getQueryParams() {
    this.route.queryParams
      .pipe(takeUntil(this.destroyed$))
      .subscribe(params => {
        this.specregId = params['specregId'];
      });
  }

  getSpecreg() {
    if (this.specregId) {
      this.directorySvc.getSpecregById(this.specregId)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(res => {
          this.specreg = res;
          this.regionComponent.setCurrentRegionById(this.specreg.regionId);
          this.changeSpecregForm();
        });
    }
  }

  changeSpecregForm() {
    if (this.formComponent && this.formComponent.documentForm) {
      if (this.specreg.iin) {
        this.formComponent.documentForm.get('iin').disable();
      }
      this.formComponent.documentForm.get('specregNumber').disable();
      this.formComponent.documentForm.get('orderNumber').disable();
      this.formComponent.documentForm.get('secondName').disable();
      this.formComponent.documentForm.get('firstName').disable();
      this.formComponent.documentForm.get('lastName').disable();
      this.formComponent.documentForm.get('specregDate').disable();
      this.cdRef.detectChanges();
    }
  }

  ngAfterViewChecked() {
    if (this.specregId && this.formComponent && this.formComponent.documentForm && !this.specregFormChanged) {
      this.changeSpecregForm();
      this.specregFormChanged = true;
    }
  }

  validate() {
    if (this.formComponent.documentForm.invalid) {
      Object.keys(this.formComponent.documentForm.controls)
        .forEach(
          controlName => this.formComponent.documentForm.controls[controlName].markAsTouched());
      return true;
    }

    if (this.specregId) {
      this.update();
    } else {
      this.save();
    }
  }

  update() {
    const specreg = Object.assign(this.specreg, this.formComponent.documentForm.getRawValue());
    this.directorySvc.updateSpecreg(specreg)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        this.snackBar.open('Спецучет редактирован успешно!', '', {duration: 3000});
        this.goBack();
      });
  }

  save() {
    this.directorySvc.saveSpecreg(this.formComponent.documentForm.getRawValue())
      .pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        this.snackBar.open('Спецучет успешно сохранен!', '', {duration: 3000});
        this.goBack();
      });
  }

  setSelectedRegionId(id) {
    if (this.formComponent) {
      this.formComponent.documentForm.controls.regionId.setValue(id);
    }
  }

  goBack() {
    this.directorySvc.goBack();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}

import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApplicationService } from 'src/app/services/application.service';
import { app } from 'src/app/shared/models/application.model';

@Component({
  selector: 'app-auction-data-form',
  templateUrl: './auction-data-form.component.html',
  styleUrls: ['./auction-data-form.component.scss']
})
export class AuctionDataFormComponent implements OnInit {

  app: app.App = new app.App();
  formParams: any[] = [];
  dynamicForm: FormGroup;

  constructor(
    private appSvc: ApplicationService,
    private dialogRef: MatDialogRef<AuctionDataFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: app.App,
  ) {
    if (data) { this.app = data; }
  }

  ngOnInit(): void {
    this.patchFormParams();
    this.dynamicForm = this.toFormGroup();
  }

  cancel() { this.dialogRef.close(); }

  patchFormParams(): void {
    this.formParams.push(
      { name: 'lotNumber', value: '', type: 'number', vs: { required: true } },
      { name: 'lotID', value: '', type: 'text', vs: { required: true } },
      { name: 'statusZU', value: '', type: 'text', vs: { required: true } },
      { name: 'lotStatus', value: '', type: 'text', vs: { required: false } },
      { name: 'publishDate', value: '', type: 'date', vs: { required: false } },
      { name: 'addressRu', value: '', type: 'text', vs: { required: false } },
      { name: 'addressKk', value: '', type: 'text', vs: { required: false } },
      { name: 'descriptionRu', value: '', type: 'text', vs: { required: false } },
      { name: 'descriptionKk', value: '', type: 'text', vs: { required: false } },
      { name: 'sellerNameRu', value: '', type: 'text', vs: { required: false } },
      { name: 'sellerNameKk', value: '', type: 'text', vs: { required: false } },
      { name: 'iinBin', value: '', type: 'number', vs: { required: false } },
      { name: 'installment', value: '', type: 'text', vs: { required: false } },
      { name: 'installmentMonths', value: '', type: 'number', vs: { required: false } },
      { name: 'landLimitsRu', value: '', type: 'text', vs: { required: false } },
      { name: 'landLimitsKk', value: '', type: 'text', vs: { required: false } },
      { name: 'noteRu', value: '', type: 'text', vs: { required: false } },
      { name: 'noteKk', value: '', type: 'text', vs: { required: false } },
      { name: 'auctionEndDate', value: '', type: 'date', vs: { required: false } },
      { name: 'rentConditionsRu', value: '', type: 'text', vs: { required: false } },
      { name: 'rentConditionsKk', value: '', type: 'text', vs: { required: false } },
      { name: 'cadastreCost', value: 0, type: 'number', vs: { required: false } },
      { name: 'initialCost', value: 0, type: 'number', vs: { required: false } },
      { name: 'landTaxCost', value: 0, type: 'number', vs: { required: false } },
      { name: 'warrantyCost', value: 0, type: 'number', vs: { required: false } },
      { name: 'auctionMethod', value: '', type: 'text', vs: { required: false } },
      { name: 'auctionPlaceRu', value: '', type: 'text', vs: { required: false } },
      { name: 'auctionPlaceKk', value: '', type: 'text', vs: { required: false } },
      { name: 'auctionDate', value: '', type: 'date', vs: { required: false } },
    );

    if (this.app && this.app.auctionInfo) {
      this.formParams.forEach(i => {
        Object.keys(this.app.auctionInfo).forEach((key) => {
          if (i.name === key) { i.value = this.app.auctionInfo[key]; }
        });
      });
    }
  }

  toFormGroup(): FormGroup {
    const group: any = {};

    this.formParams.forEach(i => {
      if (i.vs.required && i.vs.minLength && i.vs.maxLength) {
        group[i.name] = new FormControl(i.value || '', [Validators.required, Validators.minLength(i.vs.minLength),
        Validators.maxLength(i.vs.maxLength)]);
      } else if (i.vs.required) {
        group[i.name] = new FormControl(i.value || '', Validators.required);
      } else {
        group[i.name] = new FormControl(i.value || '');
      }
    });
    return new FormGroup(group);
  }

  save() {
    if (this.isValidForm()) { return; }
    this.app.auctionInfo = this.dynamicForm.value;
    this.appSvc.setApp(this.app);
    this.appSvc.updateApp(this.app.id, this.app);
    setTimeout(() => { this.dialogRef.close(this.app.auctionInfo); }, 500);
  }

  isValidForm() {
    const controls = this.dynamicForm.controls;
    if (this.dynamicForm.invalid) {
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
      return true;
    }
  }

}

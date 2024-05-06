import {Component, OnInit} from '@angular/core';
import {app} from '../../../shared/models/application.model';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ApplicationService} from '../../../services/application.service';
import GasInfo = app.GasInfo;
import {Router} from '@angular/router';
import {Subject} from "rxjs";
import GasBoiler = app.GasBoiler;
import GasStove = app.GasStove;
import GasWaterHeater = app.GasWaterHeater;

@Component({
  selector: 'app-gas-supply-form',
  templateUrl: './gas-supply-form.component.html',
  styleUrls: ['./gas-supply-form.component.scss']
})
export class GasSupplyFormComponent implements OnInit {
  gasInfo: app.GasInfo = new app.GasInfo();
  app: app.App = new app.App();
  gasForm: FormGroup;
  currentNavLinks: any;
  nextNavPosition = 10;
  prevNavPosition = 0;
  destroyed$ = new Subject();
  items: FormArray;

  constructor(
    private appSvc: ApplicationService,
    private fb: FormBuilder,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.app = this.appSvc.getApp();
    this.gasInfo = this.app.gasInfo ? this.app.gasInfo : new GasInfo();
    this.initForm();
    this.setNavLink();
  }

  setNavLink() {
    this.currentNavLinks = this.appSvc.getNavLink(this.app.subservice.id);
    this.getNavPositions();
  }

  getNavPositions() {
    const currentNavPosition = this.appSvc.getCurrentNavPosition(this.router.url, this.currentNavLinks);
    this.nextNavPosition = currentNavPosition + 1;
    this.prevNavPosition = currentNavPosition - 1;
  }

  private initForm(): void {
    this.gasForm = this.fb.group({
      id: [this.gasInfo.id],
      total: [this.gasInfo.total],
      gazification: [this.gasInfo.gazification],
      gasBoilers: this.fb.array([this.createBoiler(this.getGasBoilerForForm('gasBoilers'))]),
      gasStoves: this.fb.array([this.createBoiler(this.getGasBoilerForForm('gasStoves'))]),
      gasWaterHeaters: this.fb.array([this.createBoiler(this.getGasBoilerForForm('gasWaterHeaters'))])
    });
    this.setBoilers('gasBoilers');
    this.setBoilers('gasStoves');
    this.setBoilers('gasWaterHeaters');
  }

  public getGasBoilerForForm(field) {
    if (this.gasInfo && this.gasInfo[field] && this.gasInfo[field].length) {
      return this.gasInfo[field][0];
    } else {
      return this.getDictionaryByField(field);
    }
  }

  public getDictionaryByField(field) {
    if (field === 'gasBoilers') {
      return new GasBoiler();
    }
    if (field === 'gasStoves') {
      return new GasStove();
    }
    if (field === 'gasWaterHeaters') {
      return new GasWaterHeater();
    }
  }

  public setBoilers(field) {
    if (this.gasInfo[field]) {
      this.gasInfo[field].forEach((boiler, i) => {
        this.getGasObjectByFields(boiler);
        if (i !== 0) {
          this.items = this.gasForm.get(field) as FormArray;
          this.items.push(
            this.fb.group(this.getGasObjectByFields(boiler))
          );
        }
      });
    }
  }

  public getGasObjectByFields(boiler) {
    let newObject = {};
    for (const [key, value] of Object.entries(boiler)) {
      newObject[key] = boiler[key];
    }
    console.log(newObject);
    return newObject;
  }

  createBoiler(gasBoiler = null): FormGroup {
    return this.fb.group(this.getGasObjectByFields(gasBoiler));
  }

  addBoiler(field): void {
    this.items = this.gasForm.get(field) as FormArray;
    this.items.push(this.createBoiler(this.getDictionaryByField(field)));
  }

  onUpdateApp() {
    const controls = this.gasForm.controls;
    if (this.gasForm.invalid) {
      Object.keys(controls)
        .forEach(controlName => controls[controlName].markAsTouched());
      return;
    }

    this.app.gasInfo = this.gasForm.getRawValue();
    this.appSvc.updateApp(this.app.id, this.app, () => {
      this.changeRoute(this.currentNavLinks[this.nextNavPosition], this.nextNavPosition);
    });
  }

  changeRoute(url: any, position) {
    this.appSvc.sendBuildAppUrl(position);
    const params: any = {appId: this.app.id, subserviceId: this.app.subservice.id};
    this.router.navigate([url], {
      queryParams: params
    });
  }
}

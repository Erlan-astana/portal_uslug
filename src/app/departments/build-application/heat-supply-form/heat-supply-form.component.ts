import {Component, OnInit} from '@angular/core';
import {app} from '../../../shared/models/application.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ApplicationService} from '../../../services/application.service';
import HeatInfo = app.HeatInfo;
import {Router} from '@angular/router';

@Component({
  selector: 'app-heat-supply-form',
  templateUrl: './heat-supply-form.component.html',
  styleUrls: ['./heat-supply-form.component.scss']
})
export class HeatSupplyFormComponent implements OnInit {
  heatInfo: app.HeatInfo = new app.HeatInfo();
  app: app.App = new app.App();
  heatForm: FormGroup;
  currentNavLinks: any;
  nextNavPosition = 9;
  prevNavPosition = 7;
  constructor(
    private appSvc: ApplicationService,
    private fb: FormBuilder,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.app = this.appSvc.getApp();
    this.heatInfo = this.app.heatInfo ? this.app.heatInfo : new HeatInfo();
    this.initForm();
    this.setNavLink();
  }

  setNavLink() {
    this.currentNavLinks = this.appSvc.getNavLink(this.app.subservice.id);
    this.getNavPositions();
  }

  getNavPositions() {
    let currentNavPosition = this.appSvc.getCurrentNavPosition(this.router.url, this.currentNavLinks);
    this.nextNavPosition = currentNavPosition + 1;
    this.prevNavPosition = currentNavPosition - 1;
  }

  onUpdateApp() {
    const controls = this.heatForm.controls;
    if (this.heatForm.invalid) {
      Object.keys(controls)
        .forEach(controlName => controls[controlName].markAsTouched());
      return;
    }
    this.app.heatInfo = this.heatForm.getRawValue();
    this.appSvc.updateApp(this.app.id, this.app, () => {
      this.changeRoute(this.currentNavLinks[this.nextNavPosition], this.nextNavPosition);
    });
  }

  goBack() {
    this.appSvc.sendBuildAppUrl(this.prevNavPosition);
    this.appSvc.goBack();
  }

  private initForm(): void {
    this.heatForm = this.fb.group({
      total: [this.heatInfo.total],
      heating: [this.heatInfo.heating],
      ventilation: [this.heatInfo.ventilation],
      hotWater: [this.heatInfo.hotWater],
      technical: [this.heatInfo.technical]
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

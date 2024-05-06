import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {app} from '../../../shared/models/application.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ApplicationService} from '../../../services/application.service';
import {ActivatedRoute, Router} from '@angular/router';
import WaterInfo = app.WaterInfo;
import {AdminService} from '../../../services/admin.service';
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-water-supply-form',
  templateUrl: './water-supply-form.component.html',
  styleUrls: ['./water-supply-form.component.scss']
})
export class WaterSupplyFormComponent implements OnInit {
  waterInfo: app.WaterInfo = new app.WaterInfo();
  waterInfoForm: FormGroup;
  app: app.App = new app.App();
  subserviceId: any;
  currentNavLinks: any;
  nextNavPosition = 7;
  appId: number = null;
  prevNavPosition = 5;
  destroyed$ = new Subject();

  constructor(
    private appSvc: ApplicationService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private adminSvc: AdminService
  ) {
  }

  ngOnInit() {
    this.initForm();
    this.getApplication();
  }


  getApplication() {
    this.app = this.appSvc.getApp();
    if (!this.app.id) {
      this.getQueryParams();
    } else {
      this.subserviceId = this.app.subservice.id;
      this.setWaterInfo();
      this.setNavLink();
    }
  }

  getQueryParams() {
    this.route.queryParams.pipe(takeUntil(this.destroyed$))
      .subscribe(params => {
        this.appId = parseInt(params['appId']);
        this.subserviceId = params['subserviceId'];
        this.getAppById();
      });
  }

  getAppById() {
    if (this.appId) {
      this.appSvc.getAppReq(this.appId).pipe(takeUntil(this.destroyed$))
        .subscribe(res => {
          this.app = res;
          this.appSvc.setApp(res);
          this.setNavLink();
          this.setWaterInfo();
        });
    }
  }

  setNavLink() {
    this.currentNavLinks = this.appSvc.getNavLink(this.subserviceId);
    this.getNavPositions();
  }

  getNavPositions() {
    let currentNavPosition = this.appSvc.getCurrentNavPosition(this.router.url, this.currentNavLinks);
    this.nextNavPosition = currentNavPosition + 1;
    this.prevNavPosition = currentNavPosition - 1;
  }

  setWaterInfo() {
    this.waterInfo = this.app.waterInfo ? this.app.waterInfo : new WaterInfo();
    this.adminSvc.setForm(this.waterInfoForm.controls, this.waterInfo);
  }


  onUpdateApp() {
    const controls = this.waterInfoForm.controls;
    if (this.waterInfoForm.invalid) {
      Object.keys(controls)
        .forEach(controlName => controls[controlName].markAsTouched());
      return;
    }
    this.app.waterInfo = this.waterInfoForm.getRawValue();

    this.appSvc.setApp(this.app);
    this.appSvc.updateApp(this.app.id, this.app, () => {
      this.changeRoute(this.currentNavLinks[this.nextNavPosition], this.nextNavPosition);
    });
  }

  private initForm(): void {
    this.waterInfoForm = this.fb.group({
      total: [this.waterInfo.total],
      totalDrink: [this.waterInfo.totalDrink],
      maxTotal: [this.waterInfo.maxTotal],
      dayDrink: [this.waterInfo.dayDrink],
      dayIndustrial: [this.waterInfo.dayIndustrial],
      firefighting: [this.waterInfo.firefighting],
      hourDrink: [this.waterInfo.hourDrink],
      hourIndustrial: [this.waterInfo.hourIndustrial],
      maxDrink: [this.waterInfo.maxDrink],
      maxIndustrial: [this.waterInfo.maxIndustrial]
    });
  }

  changeRoute(url: any, position) {
    this.appSvc.sendBuildAppUrl(position);
    const params: any = {appId: this.app.id, subserviceId: this.subserviceId};
    this.router.navigate([url], {
      queryParams: params
    });
  }

}

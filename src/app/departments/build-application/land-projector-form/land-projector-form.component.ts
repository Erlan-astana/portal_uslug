import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {app} from '../../../shared/models/application.model';
import {ApplicationService} from '../../../services/application.service';
import {AuthService} from '../../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AdminService} from '../../../services/admin.service';
import LandInfo = app.LandInfo;
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-land-projector-form',
  templateUrl: './land-projector-form.component.html',
  styleUrls: ['./land-projector-form.component.scss']
})
export class LandProjectorFormComponent implements OnInit {
  projectorForm: FormGroup;
  currentNavLinks: any;
  app: app.App = new app.App();
  subserviceId: any;
  nextNavPosition = 3;
  prevPosition = 0;
  appId = null;
  landInfo: app.LandInfo = new app.LandInfo();
  destroyed$ = new Subject();

  constructor(
    private appSvc: ApplicationService,
    private authService: AuthService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private adminService: AdminService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.app = this.appSvc.getApp();
    this.app.landInfo = this.app.landInfo ? this.app.landInfo : new LandInfo();
    this.initForm();
    this.getQueryParams();
    this.setNavLink();
  }

  getQueryParams() {
    this.route.queryParams.pipe(takeUntil(this.destroyed$))
      .subscribe(params => {
      this.appId = parseInt(params['appId']);
      this.subserviceId = parseInt(params['subserviceId']);
      this.getAppById();
      this.setNavLink();
    });
  }

  getAppById() {
    if (this.appId) {
      this.appSvc.getAppReq(this.appId).pipe(takeUntil(this.destroyed$))
      .subscribe((res: app.App) => {
        this.appSvc.setApp(res);
        this.app = res;
        if (res.landInfo) {
          this.adminService.setForm(this.projectorForm.controls, res.landInfo);
        } else {
          this.app.landInfo = new LandInfo();
          this.adminService.setForm(this.projectorForm.controls, this.app.landInfo);
        }
      });
    }
  }

  private initForm(): void {
    this.projectorForm = this.fb.group({
      lastName: [this.app.landInfo.lastName],
      firstName: [this.app.landInfo.firstName],
      secondName: [this.app.landInfo.secondName],
      orgName: [this.app.landInfo.orgName, Validators.required],
      protocolNumber: [this.app.landInfo.protocolNumber],
      protocolDate: [this.app.landInfo.protocolDate],
      copyCount: [this.app.landInfo.copyCount]
    });
  }

  onUpdateApp() {
    const controls = this.projectorForm.controls;
    if (this.projectorForm.invalid) {
      Object.keys(controls)
        .forEach(controlName => controls[controlName].markAsTouched());
      return;
    }
    this.app.landInfo = this.projectorForm.getRawValue();

    this.appSvc.setApp(this.app);
    this.appSvc.updateApp(this.app.id, this.app, () => {
      this.changeRoute(this.currentNavLinks[this.nextNavPosition], this.nextNavPosition);
    });
  }

  setNavLink() {
    this.currentNavLinks = this.appSvc.getNavLink(this.subserviceId);
    this.getNavPositions();
  }

  getNavPositions() {
    const currentNavPosition = this.appSvc.getCurrentNavPosition(this.router.url, this.currentNavLinks);
    this.nextNavPosition = currentNavPosition + 1;
    this.prevPosition = currentNavPosition - 1;
  }

  changeRoute(url: any, position) {
    this.appSvc.sendBuildAppUrl(position);
    const params: any = {appId: this.appId, subserviceId: this.subserviceId};
    this.router.navigate([url], {
      queryParams: params
    });
  }

  public onDate(event): any {
    const date = event.target.value.split('.');
    this.projectorForm.get('protocolDate').setValue(new Date(date[2], date[1] - 1, date[0]));
  }
}

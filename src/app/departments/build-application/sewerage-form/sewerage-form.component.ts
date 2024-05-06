import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {app} from '../../../shared/models/application.model';
import {ApplicationService} from '../../../services/application.service';
import SewerageInfo = app.SewerageInfo;
import {Router} from '@angular/router';
import {position} from 'html2canvas/dist/types/css/property-descriptors/position';

@Component({
  selector: 'app-sewerage-form',
  templateUrl: './sewerage-form.component.html',
  styleUrls: ['./sewerage-form.component.scss']
})
export class SewerageFormComponent implements OnInit {
  sewerageInfo: app.SewerageInfo = new app.SewerageInfo();
  app: app.App = new app.App();
  sewerageForm: FormGroup;
  currentNavLinks: any;
  nextNavPosition = 8;
  prevNavPosition = 6;

  constructor(
    private appSvc: ApplicationService,
    private fb: FormBuilder,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.app = this.appSvc.getApp();
    this.sewerageInfo = this.app.sewerageInfo ? this.app.sewerageInfo : new SewerageInfo();
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

  private initForm(): void {
    this.sewerageForm = this.fb.group({
      total: [this.sewerageInfo.total],
      clean: [this.sewerageInfo.clean],
      fecal: [this.sewerageInfo.fecal],
      industrial: [this.sewerageInfo.industrial],
      maxClean: [this.sewerageInfo.maxClean],
      maxFecal: [this.sewerageInfo.maxFecal],
      maxIndustrial: [this.sewerageInfo.maxIndustrial],
      maxTotal: [this.sewerageInfo.maxTotal]
    });
  }

  onUpdateApp() {
    const controls = this.sewerageForm.controls;
    if (this.sewerageForm.invalid) {
      Object.keys(controls)
        .forEach(controlName => controls[controlName].markAsTouched());
      return;
    }
    const app_ = this.appSvc.getApp();
    app_.sewerageInfo = this.sewerageForm.getRawValue();
    this.appSvc.updateApp(app_.id, app_, () => {
      this.changeRoute(this.currentNavLinks[this.nextNavPosition], this.nextNavPosition);
    });
  }

  changeRoute(url: any, pos: any) {
    this.appSvc.sendBuildAppUrl(pos);
    const params: any = {appId: this.app.id, subserviceId: this.app.subservice.id};
    this.router.navigate([url], {
      queryParams: params
    });
  }

}

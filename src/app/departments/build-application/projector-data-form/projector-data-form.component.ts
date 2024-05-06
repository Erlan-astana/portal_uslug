import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {ApplicationService} from '../../../services/application.service';
import {app} from '../../../shared/models/application.model';
import {ROLES, USER_TYPE} from '../../../shared/utils/constants';
import {auth} from '../../../shared/models/auth.model';
import {ActivatedRoute, Router} from '@angular/router';
import {AdminService} from '../../../services/admin.service';
import DesignerInfo = app.DesignerInfo;
import {LINKS_APZ_NAVIGATOR} from '../../../shared/utils/constants';
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-projector-data-form',
  templateUrl: './projector-data-form.component.html',
  styleUrls: ['./projector-data-form.component.scss']
})
export class ProjectorDataFormComponent implements OnInit {
  title = 'Данные проектировщика';
  designerInfo: app.DesignerInfo = new app.DesignerInfo();
  isOrg = true;
  projectorForm: FormGroup;
  tokenData = null;
  isArchTech = true;
  appId = null;
  app: app.App = new app.App();
  subserviceId: any;
  currentNavLinks: any;
  nextNavPosition = 3;
  prevPosition = 0;
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
    this.getCurrentUserData();
    this.getQueryParams();
  }

  getQueryParams() {
    this.route.queryParams.pipe(takeUntil(this.destroyed$))
      .subscribe(params => {
      this.appId = parseInt(params['appId']);
      this.subserviceId = params['subserviceId'];
      this.getAppById();
      this.setNavLink();
    });
  }

  getAppById() {
    if (this.appId) {
      this.appSvc.getAppReq(this.appId).pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        this.appSvc.setApp(res);
        this.app = res;
        if (res.designerInfo) {
          this.adminService.setForm(this.projectorForm.controls, res.designerInfo);
        } else {
          this.app.designerInfo = new DesignerInfo();
          this.adminService.setForm(this.projectorForm.controls, this.app.designerInfo);
        }
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
    this.prevPosition = currentNavPosition - 1;
  }

  get formControls() {
    return this.projectorForm.controls;
  }

  public checkEventValueType(evt: any) {
    if (evt.which !== 8 && isNaN(Number(String.fromCharCode(evt.which)))) {
      evt.preventDefault();
    }
  }

  private getCurrentUserData() {
    const tokenData = this.authService.getTokenData();
    if (tokenData) {
      this.tokenData = tokenData;
      if (this.tokenData.authorities.some(e => e.startsWith(ROLES.APP))) {
        this.isArchTech = false;
        this.isOrg = this.designerInfo.userType === USER_TYPE.LEGAL ? true : false;
      } else if (this.tokenData.authorities.some(e => e.startsWith(ROLES.ARCH_TECH))) {
        this.isArchTech = true;
        if (this.designerInfo.bin) {
          this.isOrg = true;
        }
      }
      this.initForm();
      this.projectorForm.controls.isOrg.setValue(this.isOrg);
    } else {
      this.initForm();
    }

  }

  formControlValueChanged() {
    const bin = this.projectorForm.get('bin');
    const lastName = this.projectorForm.get('lastName');
    const firstName = this.projectorForm.get('firstName');
    const iin = this.projectorForm.get('iin');
    const orgName = this.projectorForm.get('orgName');
    if (this.isArchTech) {
      bin.clearValidators();
      orgName.clearValidators();
      lastName.clearValidators();
      firstName.clearValidators();
      iin.clearValidators();

      bin.updateValueAndValidity();
      orgName.updateValueAndValidity();
      lastName.updateValueAndValidity();
      firstName.updateValueAndValidity();
      iin.updateValueAndValidity();
    } else if (!this.isArchTech) {
      this.projectorForm.get('isOrg').valueChanges.pipe(takeUntil(this.destroyed$))
      .subscribe(
        (mode: boolean) => {
          if (!mode) {
            bin.clearValidators();
            orgName.clearValidators();
            lastName.setValidators([Validators.required]);
            firstName.setValidators([Validators.required]);
            iin.setValidators([Validators.required, Validators.minLength(12)]);
            this.projectorForm.controls.userType.setValue(USER_TYPE.INDIVIDUAL);
          } else {
            bin.setValidators([Validators.required]);
            orgName.setValidators([Validators.required]);
            lastName.clearValidators();
            firstName.clearValidators();
            iin.clearValidators();
            this.projectorForm.controls.userType.setValue(USER_TYPE.LEGAL);
          }
          bin.updateValueAndValidity();
          orgName.updateValueAndValidity();
          lastName.updateValueAndValidity();
          firstName.updateValueAndValidity();
          iin.updateValueAndValidity();
        });
    }
  }

  onUpdateApp() {
    const controls = this.projectorForm.controls;
    if (this.projectorForm.invalid) {
      Object.keys(controls)
        .forEach(controlName => controls[controlName].markAsTouched());
      return;
    }

    this.fillDesInfoPropsFromForm(this.app);
    if (this.isOrg) {
      this.designerInfo.userType = USER_TYPE.LEGAL;
    } else {
      this.designerInfo.userType = USER_TYPE.INDIVIDUAL;
    }
    this.app.designerInfo.userType = this.designerInfo.userType;
    this.appSvc.setApp(this.app);
    this.appSvc.updateApp(this.app.id, this.app, () => {
      this.changeRoute(this.currentNavLinks[this.nextNavPosition], this.nextNavPosition);

    });
  }

  changeRoute(url: any, position) {
    this.appSvc.sendBuildAppUrl(position);
    const params: any = {appId: this.app.id, subserviceId: this.subserviceId};
    this.router.navigate([url], {
      queryParams: params
    });
  }

  private initForm(): void {
    this.projectorForm = this.fb.group({
      isOrg: [this.isOrg],
      lastName: [this.designerInfo.lastName],
      firstName: [this.designerInfo.firstName],
      secondName: [this.designerInfo.secondName],
      iin: [this.designerInfo.iin, [Validators.maxLength(12), Validators.minLength(12)]],
      licenseNumber: [this.designerInfo.licenseNumber],
      licenseCategory: [this.designerInfo.licenseCategory],
      phone: [this.designerInfo.phone],
      bin: [this.designerInfo.bin, [Validators.maxLength(12), Validators.minLength(12)]],
      orgName: [this.designerInfo.orgName],
      userType: [this.designerInfo.userType]
    });
  }

  private fillDesInfoPropsFromForm(app_: app.App) {
    this.isOrg = this.projectorForm.value.isOrg;
    app_.designerInfo.bin = this.projectorForm.value.bin;
    app_.designerInfo.firstName = this.projectorForm.value.firstName;
    app_.designerInfo.iin = this.projectorForm.value.iin;
    app_.designerInfo.lastName = this.projectorForm.value.lastName;
    app_.designerInfo.licenseCategory = this.projectorForm.value.licenseCategory;
    app_.designerInfo.licenseNumber = this.projectorForm.value.licenseNumber;
    app_.designerInfo.orgName = this.projectorForm.value.orgName;
    app_.designerInfo.phone = this.projectorForm.value.phone;
    app_.designerInfo.secondName = this.projectorForm.value.secondName;
  }


}

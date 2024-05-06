import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {app} from '../../../shared/models/application.model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApplicationService} from '../../../services/application.service';
import {ActivatedRoute, Router} from '@angular/router';
import {dic} from '../../../shared/models/dictionary.model';
import {AuthService} from '../../../services/auth.service';
import {auth} from '../../../shared/models/auth.model';
import User = auth.User;
import {AdminModule} from '../../admin/admin.module';
import {AdminService} from '../../../services/admin.service';
import {MatSnackBar, MatDialog} from '@angular/material';
import {LINKS_APZ_NAVIGATOR, USER_TYPE} from '../../../shared/utils/constants';
import {DicApplicationService} from '../../../services/dic.application.service';
import {MessageBoxComponent} from 'src/app/components/message-box/message-box.component';
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {Region} from "../../../components/select-region/model/region.model";
import {TranslateService} from "@ngx-translate/core";


@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ApplicationFormComponent implements OnInit {
  app: app.App = new app.App();
  appForm: FormGroup;
  subserviceId: any;
  token: any;
  currentUser: User = null;
  currentNavLinks: any;
  nextNavPosition = 1;
  isOrgApp = false;
  districtList = [];
  destroyed$ = new Subject();
  regions: Region[] = [];
  currentLang;

  constructor(
    private fb: FormBuilder,
    private appSvc: ApplicationService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private dicSvc: DicApplicationService,
    private translate: TranslateService
  ) {
    this.currentLang = this.translate.currentLang ? this.translate.currentLang : this.translate.getDefaultLang();
  }

  ngOnInit() {
    this.app = this.appSvc.getApp();
    this.getRegions();
    this.getQueryParams();
    this.setNavLink();
    this.initForm();
    this.getDistricts();
    this.initTranslate();
  }

  initTranslate() {
    this.translate.onLangChange.subscribe((event: any) => {
      this.currentLang = event.lang;
      this.setAppAddress();
    });
  }

  setNavLink() {
    this.currentNavLinks = this.appSvc.getNavLink(this.subserviceId);
  }

  getQueryParams() {
    this.route.queryParams.pipe(takeUntil(this.destroyed$))
      .subscribe(params => {
        this.token = params['access_token'];
        this.subserviceId = parseInt(params['subserviceId']);
        this.setAuthUserInOtherProject();
        if (params['locale']) {
          this.currentLang = params['locale'] === 'ru' ? 'ru' : 'kk';
          this.setLocalization();
        }
        if (params['regionId']) {
          this.app = new app.App();
          this.app.regionId = parseInt(params['regionId']);
        }
      });
  }

  setLocalization(): any {
    this.translate.use(this.currentLang);
    localStorage.setItem('currentLang', this.currentLang);
  }

  setAuthUserInOtherProject() {
    if (this.token) {
      localStorage.setItem('access_token', this.token);
      this.authService.init();
      this.getCurrentUser();
    }
  }

  getCurrentUser() {
    this.authService.getCurrentUser().pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        this.currentUser = res;
        if (this.app.bin) {
          this.isOrgApp = true;
        }
        this.transferDataFromCurrentUserInfo(this.currentUser);
        this.adminService.setForm(this.appForm.controls, this.app);
      });
  }

  private transferDataFromCurrentUserInfo(currentUser: auth.User) {
    this.app.firstName = currentUser.firstName;
    this.app.lastName = currentUser.lastName;
    this.app.secondName = currentUser.secondName;
    this.app.iin = currentUser.iin;
    this.app.bin = currentUser.bin;
    this.app.org = currentUser.userType === USER_TYPE.LEGAL;
    this.app.subservice.id = this.subserviceId;
    if (currentUser.orgName) {
      this.app.orgName = currentUser.orgName.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    }
    this.setAppAddress();
  }

  public setAppAddress() {
    this.app.address = this.getAddressByLang();
    if (this.appForm && this.appForm.controls) {
      this.appForm.controls.address.setValue(this.app.address);
      this.appForm.controls.address.updateValueAndValidity();
    }
  }

  getAddressByLang() {
    const result = this.currentLang === 'ru' ? `080110, Республика Казахстан, Жамбылская область, ${this.getRegionNameByRegionId()}` :
      `080110, Қазақстан Республикасы, Жамбыл облысы,  ${this.getRegionNameByRegionId()}`;
    return result;
  }

  getRegionNameByRegionId(regionId = null) {
    let regionName = '';
    const region = this.dicSvc.getRegionById(this.regions, regionId || this.app.regionId);
    regionName = region ? region['name' + this.capitalizeFirstLetter(this.currentLang)] : 'г.Тараз';
    return regionName;
  }

  capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  async getRegions() {
    this.dicSvc.getRegions().then((data: Region[]) => {
      this.regions = data;
      this.setAppAddress();
    });
  }

  initForm() {
    this.appForm = this.fb.group({
      lastName: {value: this.app.lastName, disabled: true},
      firstName: {value: this.app.firstName, disabled: true},
      secondName: {value: this.app.secondName, disabled: true},
      iin: {value: this.app.iin, disabled: true},
      address: [this.app.address, Validators.required],
      phone: [this.app.phone, Validators.required],
      regionId: [this.app.regionId, Validators.required],
      bin: [this.app.bin],
      orgName: [this.app.orgName],
      org: [this.app.org, Validators.required],
      subservice: this.fb.group({
        id: [this.subserviceId, Validators.required]
      }),
      otherApplicant: [this.app.otherApplicant],
      applicantIinBin: [this.app.applicantIinBin],
      applicantName: [this.app.applicantName],
      applicantIsOrg: [this.app.applicantIsOrg],
      identityCardNumber: [this.app.identityCardNumber],
      identityCardDistributor: [this.app.identityCardDistributor]
    });
    if (this.subserviceId === 14) {
      this.appForm.addControl('ozoInfo',
        this.fb.group({districts: [this.app.ozoInfo.districts, Validators.required]}));
    }
  }

  get formControls() {
    return this.appForm.controls;
  }

  validate() {
    if (this.appForm.invalid) {
      Object.keys(this.appForm.controls)
        .forEach(controlName => this.appForm.controls[controlName].markAsTouched());
      return;
    }

    if (this.checkNumberLength(this.appForm.controls.iin.value)) {
      this.create();
    } else {
      this.snackBar.open('Указан неправильный формат ИИН!', '', {duration: 3000});
    }
  }

  public checkEventValueType(evt: any) {
    if (evt.which !== 8 && isNaN(Number(String.fromCharCode(evt.which)))) {
      evt.preventDefault();
    }
    if (evt.target.value.length > 11) {
      evt.preventDefault();
    }
  }

  public checkEventValueCardNumber(evt: any) {
    if (evt.which !== 8 && isNaN(Number(String.fromCharCode(evt.which)))) {
      evt.preventDefault();
    }
    if (evt.target.value.length > 8) {
      evt.preventDefault();
    }
  }

  private checkNumberLength(num: string) {
    const result = num.length >= 12 ? true : false;
    return result;
  }

  create() {
    if (!this.app.id) {
      const data = this.appForm.getRawValue();
      if (this.subserviceId === 14) {
        data.ozoInfo.districts = JSON.stringify(data.ozoInfo.districts);
      }
      if (this.subserviceId === 37) {
        this.checkingSpecregByIIN(data);
      } else {
        this.createApp(data);
      }
    }
  }

  createApp(data) {
    this.appSvc.createApp(data, (app) => {
      this.app = app;
      this.appSvc.setApp(app);
      this.changeRoute(this.currentNavLinks[this.nextNavPosition]);
    });
  }

  changeRoute(url: any) {
    this.appSvc.sendBuildAppUrl(this.nextNavPosition);
    const params: any = {appId: this.app.id, subserviceId: this.subserviceId};
    this.router.navigate([url], {
      queryParams: params
    });
  }

  private getDistricts() {
    this.dicSvc.getDisctrictsReq().pipe(takeUntil(this.destroyed$))
      .subscribe(data => {
        this.districtList = data;
      });
  }

  checkingSpecregByIIN(data: app.App) {
    this.appSvc.checkingSpecregByIIN(this.appForm.controls.iin.value).pipe(takeUntil(this.destroyed$))
      .subscribe((response) => {
        if (response.exists) {
          this.showSpecRegMessage(response.orderNumber, response.regionId);
        } else {
          this.createApp(data);
        }
      });
  }

  showSpecRegMessage(orderNumber, regionId) {
    let text = `Вы не можете подать на данную услугу, т.к на основании заключения городской комиссии по 
        предоставлению земельных участков в собственность и землепользование Вы зарегистрированы в списке 
        специального учета заявлений за номером ${orderNumber}`;
    if (regionId) {
      const regionName = this.getRegionNameByRegionId(regionId);
      text = text + ` в регионе ${regionName}`;
    }
    const dialogRef = this.dialog.open(MessageBoxComponent, {
      width: '600px',
      data: {
        title: 'Уведомление',
        message: text
      }
    });

    dialogRef.afterClosed().pipe(takeUntil(this.destroyed$))
      .subscribe(result => {
        this.router.navigate(['/']);
      });
  }

  changeRadioBtn(event) {
    if (event) {
      this.appForm.get('applicantIinBin').setValidators([Validators.required, Validators.minLength(12)]);
      this.appForm.controls['lastName'].enable();
      this.appForm.controls['firstName'].enable();
      this.appForm.controls['secondName'].enable();
      this.appForm.controls['iin'].enable();
    } else {
      this.appForm.get('applicantIinBin').clearValidators();
      this.appForm.get('applicantIinBin').updateValueAndValidity();
      this.appForm.controls['lastName'].disable();
      this.appForm.controls['firstName'].disable();
      this.appForm.controls['secondName'].disable();
      this.appForm.controls['iin'].disable();
    }
  }

  /*public compareWithFunc(a, b) {
    if (a && b) {
      return a.name === b.name;
    }
  }*/

}

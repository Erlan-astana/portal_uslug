import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {app} from '../../../shared/models/application.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {dic} from '../../../shared/models/dictionary.model';
import {ApplicationService} from '../../../services/application.service';
import {DicApplicationService} from '../../../services/dic.application.service';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {ElectricinfoCategoryDescriptionComponent} from './electricinfo-category-description/electricinfo-category-description.component';
import {ActivatedRoute, Router} from '@angular/router';
import ElectricInfo = app.ElectricInfo;
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-electrification-form',
  templateUrl: './electrification-form.component.html',
  styleUrls: ['./electrification-form.component.scss']
})
export class ElectrificationFormComponent implements OnInit {
  title = 'Электроснабжение';
  electricInfo: app.ElectricInfo = new app.ElectricInfo();
  electricForm: FormGroup;
  phase: dic.Phase = new dic.Phase();
  phasePeriod: dic.PhasePeriod = new dic.PhasePeriod();
  maxLoadByYearsObjectLst: app.MaxLoadByYearsObject[] = [new app.MaxLoadByYearsObject()];
  phases: any = [];
  phasesPeriods: any = [];
  app: app.App = new app.App();
  subserviceId: any;
  currentNavLinks: any;
  nextNavPosition = 6;
  prevNavPosition = 0;
  appId: number = null;
  @Output() electricInfoStatus = new EventEmitter();
  destroyed$ = new Subject();
  currentLang: string;
  
  constructor(
    private appSvc: ApplicationService,
    private dicSvc: DicApplicationService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    public translate: TranslateService
  ) {
  }

  ngOnInit() {
    this.getApplication();
    this.initForm();
    this.getPhases();
    this.getPhasesPeriods();
    this.currentLang = this.translate.currentLang ? this.translate.currentLang : this.translate.getDefaultLang();
    this.translate.onLangChange.pipe(takeUntil(this.destroyed$))
    .subscribe((event: any) => {
      this.currentLang = event.lang;
    });
  }

  getApplication() {
    this.app = this.appSvc.getApp();
    if (!this.app.id) {
      this.getQueryParams();
    } else {
      this.subserviceId = this.app.subservice.id;
      this.setElectricInfo();
      this.setNavLink();
    }
  }

  setElectricInfo() {
    if (this.app.electricInfo) {
      this.electricInfo = this.app.electricInfo;
      if (this.electricInfo.maxLoadByYears) {
        this.maxLoadByYearsObjectLst = JSON.parse(this.electricInfo.maxLoadByYears);
      }
    } else {
      this.app.electricInfo = new ElectricInfo();
    }
    if (!this.app.electricInfo.relCat) {
      this.app.electricInfo.relCat = '3';
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
          this.setElectricInfo();
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

  private initForm(): void {
    this.electricForm = this.fb.group({
      boilerCount: [this.app.electricInfo.boilerCount],
      boilerPower: [this.app.electricInfo.boilerPower],
      furnaceCount: [this.app.electricInfo.furnaceCount],
      furnacePower: [this.app.electricInfo.furnacePower],
      heaterCount: [this.app.electricInfo.heaterCount],
      heaterPower: [this.app.electricInfo.heaterPower],
      loadCat1: [this.app.electricInfo.loadCat1],
      loadCat2: [this.app.electricInfo.loadCat2],
      loadCat3: [this.app.electricInfo.loadCat3],
      maxLoad: [this.app.electricInfo.maxLoad],
      maxLoadByYears: [this.app.electricInfo.maxLoadByYears],
      phase: [this.app.electricInfo.phase.id],
      phasePeriod: [this.app.electricInfo.phasePeriod.id],
      relCat: [this.app.electricInfo.relCat],
      relCat1: [this.app.electricInfo.relCat1],
      relCat2: [this.app.electricInfo.relCat2],
      relCat3: [this.app.electricInfo.relCat3],
      requiredPower: [this.app.electricInfo.requiredPower],
      stoveCount: [this.app.electricInfo.stoveCount],
      stovePower: [this.app.electricInfo.stovePower],
      transformerNumber1: [this.app.electricInfo.transformerNumber1],
      transformerNumber2: [this.app.electricInfo.transformerNumber2],
      transformerPower1: [this.app.electricInfo.transformerPower1],
      transformerPower2: [this.app.electricInfo.transformerPower2],
      waterHeaterCount: [this.app.electricInfo.waterHeaterCount],
      waterHeaterPower: [this.app.electricInfo.waterHeaterPower]
    });
  }

  addMaxLoadItem() {
    this.maxLoadByYearsObjectLst.push(new app.MaxLoadByYearsObject());
  }

  onUpdateApp() {
    const controls = this.electricForm.controls;
    if (this.electricForm.invalid) {
      Object.keys(controls)
        .forEach(controlName => controls[controlName].markAsTouched());
      return;
    }

    this.fillElectrPropsFromForm(this.app);
    this.app.electricInfo.maxLoadByYears = JSON.stringify(this.maxLoadByYearsObjectLst);
    // app.electricInfo.maxLoadByYears = JSON.stringify(this.electricForm.value.maxLoadByYearsObjectLst);
    this.appSvc.setApp(this.app);
    this.appSvc.updateApp(this.app.id, this.app, (res) => {
      this.changeRoute(this.currentNavLinks[this.nextNavPosition], this.nextNavPosition);
    });
    this.electricInfoStatus.emit(true);
  }

  private getPhases() {
    const resp = this.dicSvc.getPhasesReq();
    resp.pipe(takeUntil(this.destroyed$))
      .subscribe(
        (data) => {
          this.phases = data;
        });
  }

  private getPhasesPeriods() {
    const resp = this.dicSvc.getPhasesPeriodsReq();
    resp.pipe(takeUntil(this.destroyed$))
      .subscribe(
        (data) => {
          this.phasesPeriods = data;
        });
  }

  openRelCategoryDescription() {
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.height = '80%';
    dialogConfig.maxWidth = '80%';
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(ElectricinfoCategoryDescriptionComponent, dialogConfig);
  }

  private fillElectrPropsFromForm(app_: app.App) {
    app_.electricInfo.boilerCount = this.electricForm.value.boilerCount;
    app_.electricInfo.boilerPower = this.electricForm.value.boilerPower;
    app_.electricInfo.furnaceCount = this.electricForm.value.furnaceCount;
    app_.electricInfo.furnacePower = this.electricForm.value.furnacePower;
    app_.electricInfo.heaterCount = this.electricForm.value.heaterCount;
    app_.electricInfo.heaterPower = this.electricForm.value.heaterPower;
    app_.electricInfo.loadCat1 = this.electricForm.value.loadCat1;
    app_.electricInfo.loadCat2 = this.electricForm.value.loadCat2;
    app_.electricInfo.loadCat3 = this.electricForm.value.loadCat3;
    app_.electricInfo.maxLoad = this.electricForm.value.maxLoad;
    app_.electricInfo.phase.id = this.electricForm.value.phase;
    app_.electricInfo.phasePeriod.id = this.electricForm.value.phasePeriod;
    app_.electricInfo.relCat = this.electricForm.value.relCat;
    app_.electricInfo.relCat1 = this.electricForm.value.relCat1;
    app_.electricInfo.relCat2 = this.electricForm.value.relCat2;
    app_.electricInfo.relCat3 = this.electricForm.value.relCat3;
    app_.electricInfo.requiredPower = this.electricForm.value.requiredPower;
    app_.electricInfo.stoveCount = this.electricForm.value.stoveCount;
    app_.electricInfo.stovePower = this.electricForm.value.stovePower;
    app_.electricInfo.transformerNumber1 = this.electricForm.value.transformerNumber1;
    app_.electricInfo.transformerNumber2 = this.electricForm.value.transformerNumber2;
    app_.electricInfo.transformerPower1 = this.electricForm.value.transformerPower1;
    app_.electricInfo.transformerPower2 = this.electricForm.value.transformerPower2;
    app_.electricInfo.waterHeaterCount = this.electricForm.value.waterHeaterCount;
    app_.electricInfo.waterHeaterPower = this.electricForm.value.waterHeaterPower;
  }

  changeRoute(url: any, position) {
    this.appSvc.sendBuildAppUrl(position);
    const params: any = {appId: this.app.id, subserviceId: this.subserviceId};
    this.router.navigate([url], {
      queryParams: params
    });
  }
}

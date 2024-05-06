import {AfterViewInit, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {app} from '../../../shared/models/application.model';
import {ApplicationService} from '../../../services/application.service';
import {ActivatedRoute, Router} from '@angular/router';
import {mapmodel} from '../../../shared/models/map.model';
import * as L from 'leaflet';
import {MapService} from '../../../services/map.service';
import {GeomService} from '../../../services/geom.service';
import {MapControlsService} from '../../../services/map.controls.service';
import {AdminService} from '../../../services/admin.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import ObjectInfo = app.ObjectInfo;
import {LoginComponent} from '../../../core/auth/login/login.component';
import {InstructionSiteDesignationComponent} from './instruction-site-designation/instruction-site-designation.component';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {DicApplicationService} from '../../../services/dic.application.service';
import {Region} from '../../../components/select-region/model/region.model';


@Component({
  selector: 'app-object-data-form',
  templateUrl: './object-data-form.component.html',
  styleUrls: ['./object-data-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ObjectDataFormComponent implements OnInit, AfterViewInit {
  objectInfoForm: FormGroup;
  app: app.App = new app.App();
  isMapInitialized: boolean = false;
  map: L.Map;
  editableLayers: L.FeatureGroup = new L.FeatureGroup();
  objectGeom = null;
  currentPolygon: L.Polygon<any>;
  btnPolRemVisib: boolean = false;
  curPolygon: L.Polygon<any>;
  appId: number = null;
  cadastralError: boolean = false;
  subserviceId: any;
  currentNavLinks: any;
  nextNavPosition = 0;
  prevPosition = 1;
  checkboxValue = false;
  submitted: boolean;
  destroyed$ = new Subject();
  gosTypes: any = [
    {value: true, nameru: 'Государственное имущество', namekk: 'Мемлекеттік меншік'},
    {value: false, nameru: 'Частное', namekk: 'Жекеменшік'}];
  uzoOzoTypes: any = [
    {nameru: 'Управление земельных отношений', namekk: 'Жер қатынастары басқармасы'},
    {nameru: 'Отдел земельных отношений', namekk: 'Жер қатынастары бөлімі'}];
  articleTypes: any = [
    {
      nameru: 'для проведения работ по добыче',
      namekk: 'өндіру жөніндегі жұмыстарды жүргізу үшін'
    },
    {
      nameru: 'по совмещенной разведке и добыче',
      namekk: 'бірлескен барлау және өндіру бойынша'
    },
    {
      namekk: 'барлаумен және (немесе) өндірумен байланысты емес жерасты құрылыстарын салу және (немесе) пайдалану бойынша',
      nameru: 'по строительству и (или) эксплуатации подземных сооружений, не связанных с разведкой и (или) добычей'
    }];
  articleTypesDivisibility: any = [
    {
      nameru: 'для проведения работ на пашне',
      namekk: 'егiстiкте жұмыстар жүргізу үшін'
    },
    {
      nameru: 'для проведения работ улучшенных сенокосах и пастбищах',
      namekk: 'жақсартылған шабындықтар мен жайылымдарда жұмыстар жүргізу үшін'
    },
    {
      nameru: 'для проведения работ на землях, занятых многолетними насаждениями',
      namekk: 'жақсартылған шабындықтар мен жайылымдарда жұмыстар жүргізу үшін'
    },
    {
      nameru: 'для проведения работ особо охраняемых природных территорий и землях лесного фонда',
      namekk: 'ерекше қорғалатын табиғи аумақтар жерлерiнде және орман қоры жерлерiнде жұмыстар жүргізу үшін'
    }];
  specregAreaTypes: any = [
    {nameru: 'до 10 соток', namekk: '10 соткаға дейін'},
    {nameru: 'до 15 соток', namekk: '15 соткаға дейін'},
    {nameru: 'до 25 соток', namekk: '25 соткаға дейін'}];
  specregPurposeTypes: any = [
    {nameru: 'для индивидуального жилищного строительства', namekk: 'жеке тұрғын үй құрылысын жүргізу үшін'},
    {
      nameru: 'для индивидуального жилищного строительства и для ведения личного подсобного хозяйства',
      namekk: 'жеке тұрғын үй құрылысын және өзіндік шаруақожалығын жүргізу үшін'
    }];
  landCodeTypes: any = [
    {nameru: 'для проведения работ на пашне', namekk: 'егiстiкте жұмыстар жүргізу үшін'},
    {
      nameru: 'для проведения работ улучшенных сенокосах и пастбищах',
      namekk: 'жақсартылған шабындықтар мен жайылымдарда жұмыстар жүргізу үшін'
    },
    {
      nameru: 'для проведения работ на землях, занятых многолетними насаждениями',
      namekk: 'жақсартылған шабындықтар мен жайылымдарда жұмыстар жүргізу үшін'
    },
    {
      nameru: 'для проведения работ особо охраняемых природных территорий и землях лесного фонда',
      namekk: 'ерекше қорғалатын табиғи аумақтар жерлерiнде және орман қоры жерлерiнде жұмыстар жүргізу үшін'
    }
  ];
  currentLang;
  regions: Region[] = [];

  constructor(
    private fb: FormBuilder,
    private appSvc: ApplicationService,
    private router: Router,
    private mapSvc: MapService,
    private mapControlsSvc: MapControlsService,
    private geomSvc: GeomService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private adminService: AdminService,
    private dialog: MatDialog,
    private translate: TranslateService,
    private dicSvc: DicApplicationService,
  ) {
    this.currentLang = this.translate.currentLang ? this.translate.currentLang : this.translate.getDefaultLang();
  }

   ngOnInit() {
    this.getQueryParams();
    this.btnPolRemVisib = true;
    this.initForm();
    this.translate.onLangChange.pipe(takeUntil(this.destroyed$))
      .subscribe((event: any) => {
        this.currentLang = event.lang;
      });
    this.getRegions();
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

  getRegions() {
    this.dicSvc.getRegions().then((res: Region[]) => {
      this.regions = res;
    });
  }

  getAppById() {
    if (this.appId) {
      this.appSvc.getAppReq(this.appId).pipe(takeUntil(this.destroyed$))
        .subscribe(res => {
          this.app = res;
          this.appSvc.setApp(this.app);
          if (this.subserviceId !== '37') {
            this.adminService.setForm(this.objectInfoForm.controls, this.app.objectInfo || new ObjectInfo());
          }
          if (this.app.objectInfo) {
            this.showLocation();
          }
          /*if (this.app.subservice.id === 17) {
            this.checkboxValue = this.app.objectInfo.cadastreNumber !== null ? true : false;
            this.objectInfoForm.controls.checkbox_value.setValue(this.checkboxValue);
          }*/
        });
    }

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

  ngAfterViewInit() {
    this.checkMapInitialize();
  }

  private checkMapInitialize() {
    if (!this.isMapInitialized && this.subserviceId !== '37') {
      this.initMap();
      this.initDrawSubscription();
      this.showLocation();
      this.isMapInitialized = true;
    }
  }

  private initDrawSubscription() {
    this.mapControlsSvc.drawSubject.pipe(takeUntil(this.destroyed$))
      .subscribe((val: any) => {
        if (val.drawevent === 'drawend') {
          this.cleanAllFeatures();
          this.editableLayers.addLayer(val.layer);
          const geoData = val.layer.toGeoJSON();
          this.fillObjectGeom(geoData, true);
        }
      });
  }

  initForm() {
    if (this.subserviceId === '25' || this.subserviceId === '50' || this.subserviceId === '75') {
      return this.objectInfoForm = this.fb.group({
        name: [this.app.objectInfo.name],
        address: [this.app.objectInfo.address, Validators.required],
        useRight: [this.app.objectInfo.useRight, Validators.required],
        purpose: [this.app.objectInfo.purpose, Validators.required],
        purposeRequested: [this.app.objectInfo.purposeRequested, Validators.required],
        area: [this.app.objectInfo.area, Validators.required],
        changeReason: [this.app.objectInfo.changeReason, Validators.required],
        cadastreNumber: [this.app.objectInfo.cadastreNumber, [Validators.required, Validators.minLength(9)]],
        location: [this.objectGeom],
        identDocNumber: [this.app.objectInfo.identDocNumber, Validators.required],
        identDocDate: [this.app.objectInfo.identDocDate, Validators.required],
        legalDocNumber: [this.app.objectInfo.legalDocNumber, Validators.required],
        legalDocDate: [this.app.objectInfo.legalDocDate, Validators.required],
        additionalPurposeUse: [this.app.objectInfo.additionalPurposeUse],
        additionalArea: {
          value: this.app.objectInfo.additionalArea,
          disabled: true
        }
      });
    }
    if (this.subserviceId === '1' || this.subserviceId === '2' || this.subserviceId === '3'
      || this.subserviceId === '4' || this.subserviceId === '9') {
      return this.objectInfoForm = this.fb.group({
        name: [this.app.objectInfo.name],
        address: [this.app.objectInfo.address, Validators.required],
        period: [this.app.objectInfo.period],
        floorsCount: [this.app.objectInfo.floorsCount],
        area: [this.app.objectInfo.area],
        flatsCount: [this.app.objectInfo.flatsCount],
        roomsCount: [this.app.objectInfo.roomsCount],
        cabinetsCount: [this.app.objectInfo.cabinetsCount],
        cadastreNumber: [this.app.objectInfo.cadastreNumber, Validators.required],
        location: [this.objectGeom],
      });
    }
    if (this.subserviceId === '21') {
      return this.objectInfoForm = this.fb.group({
        cadastreNumber: [this.app.objectInfo.cadastreNumber, Validators.required],
        designer: [this.app.objectInfo.designer, Validators.required],
        licenseCategoryGsl: [this.app.objectInfo.licenseCategoryGsl, [Validators.required, Validators.max(3), Validators.min(1)]],
        licenseNumberGsl: [this.app.objectInfo.licenseNumberGsl, Validators.required],
        licenseDateGsl: [this.app.objectInfo.licenseDateGsl, Validators.required],
        name: [this.app.objectInfo.name],
        location: [this.objectGeom],
        address: [this.app.objectInfo.address, Validators.required],
      });
    }


    if (this.subserviceId === '37') {
      return this.objectInfoForm = this.fb.group({
        area: [{value: ''}, Validators.required],
        address: [{value: ``, disabled: true}, Validators.required],
        purpose: [{
          value: '',
        }, Validators.required],
      });
    }

    this.objectInfoForm = this.fb.group({
      name: [this.app.objectInfo.name],
      address: [this.app.objectInfo.address, Validators.required],
      purpose: [this.app.objectInfo.purpose],
      sectionPurpose: [this.app.objectInfo.sectionPurpose],
      checkbox_value: [this.checkboxValue],
      area: [this.app.objectInfo.area],
      gos: [this.app.objectInfo.gos],
      uzoOzo: [this.app.objectInfo.uzoOzo],
      rightDocsReason: [this.app.objectInfo.rightDocsReason],
      gosAktNumber: [this.app.objectInfo.gosAktNumber],
      akimDecisionNumber: [this.app.objectInfo.akimDecisionNumber],
      akimDecisionDate: [this.app.objectInfo.akimDecisionDate],
      cadastreNumber: [this.app.objectInfo.cadastreNumber],
      location: [this.objectGeom],
      changeReason: [this.app.objectInfo.changeReason],
      cultBuilding: [this.app.objectInfo.cultBuilding],
      financingSource: [this.app.objectInfo.financingSource],
      buildingCapacity: [this.app.objectInfo.buildingCapacity],
      religion: [this.app.objectInfo.religion],
      floorsCount: [this.app.objectInfo.floorsCount],
      reason: [this.app.objectInfo.reason],
      useRight: [this.app.objectInfo.useRight],
      surveyWorkType: [this.app.objectInfo.surveyWorkType],
      surveyWorkPurpose: [this.app.objectInfo.surveyWorkPurpose],
      surveyWorkReason: [this.app.objectInfo.surveyWorkReason],
      landType: [this.app.objectInfo.landType],
      term: [this.app.objectInfo.term],
      workSchedule: [this.app.objectInfo.workSchedule],
      orgName: [this.app.landInfo.orgName],
      copyCount: [this.app.landInfo.copyCount],
      designer: [this.app.objectInfo.designer],
    });
    this.setRequiredToFormByServiceId();
  }

  setRequiredToFormByServiceId() {
    if (this.subserviceId === '134') {
      this.objectInfoForm.get('cadastreNumber').setValidators([Validators.required]);
      this.objectInfoForm.get('area').setValidators([Validators.required]);
      this.objectInfoForm.get('purpose').setValidators([Validators.required]);
      this.objectInfoForm.get('name').setValidators([Validators.required]);
      this.objectInfoForm.get('akimDecisionNumber').setValidators([Validators.required]);
      this.objectInfoForm.get('akimDecisionDate').setValidators([Validators.required]);
      this.objectInfoForm.get('copyCount').setValidators([Validators.required]);
      this.objectInfoForm.get('designer').setValidators([Validators.required]);
    }
    if (this.subserviceId === '23') {
      this.objectInfoForm.get('cadastreNumber').setValidators([Validators.required]);
      this.objectInfoForm.get('useRight').setValidators([Validators.required]);
      this.objectInfoForm.get('area').setValidators([Validators.required]);
      this.objectInfoForm.get('purpose').setValidators([Validators.required]);
    }
    if (this.subserviceId === '33') {
      this.objectInfoForm.get('cadastreNumber').setValidators([Validators.required]);
      this.objectInfoForm.get('area').setValidators([Validators.required]);
      this.objectInfoForm.get('purpose').setValidators([Validators.required]);
    }
    if (this.subserviceId === '8') {
      this.objectInfoForm.get('area').setValidators([Validators.required]);
      this.objectInfoForm.get('cultBuilding').setValidators([Validators.required]);
      this.objectInfoForm.get('financingSource').setValidators([Validators.required]);
      this.objectInfoForm.get('buildingCapacity').setValidators([Validators.required]);
    }
    if (this.subserviceId === '18') {
      this.objectInfoForm.get('cadastreNumber').setValidators([Validators.required]);
      this.objectInfoForm.get('name').setValidators([Validators.required]);
      this.objectInfoForm.get('purpose').setValidators([Validators.required]);
      this.objectInfoForm.get('rightDocsReason').setValidators([Validators.required]);
      this.objectInfoForm.get('gosAktNumber').setValidators([Validators.required]);
      this.objectInfoForm.get('akimDecisionNumber').setValidators([Validators.required]);
      this.objectInfoForm.get('changeReason').setValidators([Validators.required]);
    }
    if (this.subserviceId === '77') {
      this.objectInfoForm.get('area').setValidators([Validators.required]);
      this.objectInfoForm.get('cadastreNumber').setValidators([Validators.required]);
      this.objectInfoForm.get('purpose').setValidators([Validators.required]);
      this.objectInfoForm.get('useRight').setValidators([Validators.required]);
      this.objectInfoForm.get('reason').setValidators([Validators.required]);
      this.objectInfoForm.get('sectionPurpose').setValidators([Validators.required]);
    }
    if (this.subserviceId === '135') {
      this.objectInfoForm.get('cadastreNumber').setValidators([Validators.required]);
      this.objectInfoForm.get('surveyWorkType').setValidators([Validators.required]);
      this.objectInfoForm.get('surveyWorkPurpose').setValidators([Validators.required]);
      this.objectInfoForm.get('surveyWorkReason').setValidators([Validators.required]);
      this.objectInfoForm.get('area').setValidators([Validators.required]);


      this.objectInfoForm.get('landType').setValidators([Validators.required]);
      this.objectInfoForm.get('term').setValidators([Validators.required]);
      this.objectInfoForm.get('workSchedule').setValidators([Validators.required]);

    }
  }

  getRegionNameByRegionId() {
    let regionName = 'Тараз қаласы';
    const region = this.dicSvc.getRegionById(this.regions, this.app.regionId);
    if (region) {
      regionName = region.nameKk ? region['name' + this.capitalizeFirstLetter('kk')] : 'Тараз қаласы';
    }
    return regionName;
  }

  capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  serviceWithouName() {
    const unavailableServiceIds = [8, 23, 107, 130, 131, 132, 134, 135, 77];
    const result = unavailableServiceIds.some(id => id === parseInt(this.subserviceId));
    return !result;
  }

  getBadgeRequired(field) {
    if (this.objectInfoForm.controls[field]) {
      if (this.objectInfoForm.controls[field].validator) {
        return '*';
      }
    }
  }

  get formControls() {
    return this.objectInfoForm.controls;
  }

  public onDate(event): any {
    const date = event.target.value.split('.');
    this.objectInfoForm.get('licenseDateGsl').setValue(new Date(date[2], date[1] - 1, date[0]));
  }

  additionalPurposeUseChanged(value) {
    if (value) {
      this.objectInfoForm.controls.additionalArea.enable();
    } else {
      this.objectInfoForm.controls.additionalArea.disable();
    }
  }

  validate() {
    this.submitted = true;
    if (this.objectInfoForm.invalid) {
      Object.keys(this.objectInfoForm.controls)
        .forEach(
          controlName => this.objectInfoForm.controls[controlName].markAsTouched());
      return;
    }
    this.update();
  }

  update() {
    if (this.checkObjectLocation(this.app)) {
      this.app.objectInfo = this.objectInfoForm.getRawValue();
      this.appSvc.updateApp(this.app.id, this.app, () => {
        this.changeRoute(this.currentNavLinks[this.nextNavPosition], this.nextNavPosition);
      });
    }
  }

  checkObjectLocation(application: app.App) {
    if (this.objectGeom && this.objectGeom !== '' || !this.getBadgeRequired('cadastreNumber')) {
      if (this.objectInfoForm.controls.location) {
        this.objectInfoForm.controls.location.setValue(this.objectGeom);
      }
      return true;
    } else {
      this.snackBar.open('Земельный участок не указан!', '', {duration: 3000});
      return false;
    }

  }

  changeRoute(url, navPosition) {
    this.appSvc.sendBuildAppUrl(navPosition);
    const params: any = {appId: this.app.id, subserviceId: this.subserviceId};
    this.router.navigate([url], {
      queryParams: params
    });
  }

  public checkEventValueType(evt: any) {
    if (evt.key !== '.' && evt.key !== '0') {
      if (evt.which !== 12 && !parseInt(evt.key)) {
        evt.preventDefault();
      }
    }
  }

  private initMap() {
    const ControlOptions: mapmodel.ControlOpts = {
      scale: true,
      fullscreen: true
    };
    this.map = this.mapSvc.initMap('objectmapid', ControlOptions);
    this.map.addLayer(this.editableLayers);

    if (this.subserviceId !== '25' && this.subserviceId !== '50') {
      this.mapControlsSvc.initDraw(this.map, {
          layers: this.editableLayers,
          edit: false,
          remove: true
        }, {
          position: 'topright',
          draw: ['polygon']
        }
      );
    }
  }

  private showLocation() {
    if (this.app.objectInfo.location && this.app.objectInfo.location !== '') {
      this.curPolygon = this.geomSvc.showPolygon(this.map, this.app.objectInfo.location);
      this.objectGeom = (this.app.objectInfo.location);
      if (this.curPolygon) {
        this.btnPolRemVisib = true;
      }
    }
  }

  checkCadNumber() {
    if (this.objectGeom) {
      this.removeCadPolygonGeom();
    }
    if (this.objectInfoForm.controls.cadastreNumber.value) {
      const cadNumStr = this.objectInfoForm.controls.cadastreNumber.value;
      this.cadastralError = false;
      if (cadNumStr.length > 9) {
        const geomGJson = this.mapSvc.getLandGeomByCadNumber(cadNumStr);
        geomGJson.pipe(takeUntil(this.destroyed$))
          .subscribe(data => {
            const polygon: L.Polygon = this.geomSvc.getGeomFromCadNumberData(data);
            if (polygon) {
              this.cleanAllFeatures();
              const geoData = polygon.toGeoJSON();
              this.fillObjectGeom(geoData, false);
              this.currentPolygon = polygon;
              polygon.addTo(this.map);
              this.btnPolRemVisib = true;
              this.map.fitBounds(this.currentPolygon.getBounds());
            } else {
              this.cadastralError = true;
            }
          });
      }
    }
  }

  cleanAllFeatures() {
    if (this.editableLayers.getLayers().length > 0) {
      this.editableLayers.clearLayers();
    }
    if (this.currentPolygon) {
      this.map.removeLayer(this.currentPolygon);
      this.currentPolygon = null;
      this.btnPolRemVisib = false;
    }
  }

  private fillObjectGeom(geoData, isdrawn) {
    geoData.properties.isdrawn = isdrawn;
    this.objectGeom = JSON.stringify(geoData);
  }

  removeCadPolygonGeom() {
    this.cleanAllFeatures();
    this.objectInfoForm.controls.cadastreNumber.setValue('');
    this.objectGeom = null;
  }

  showInstructions() {
    const dialogRef = this.dialog.open(InstructionSiteDesignationComponent, {
      width: '60%',
      data: {}
    });
  }

  specregAreaChange(value) {
    if (value.includes('10')) {
      this.objectInfoForm.controls.purpose.setValue(this.specregPurposeTypes[0]['name' + this.currentLang]);
    }
    if (value.includes('15')) {
      this.objectInfoForm.controls.purpose.setValue(this.specregPurposeTypes[1]['name' + this.currentLang]);
    }
  }

  setSelectedRegionIdInUserAndRoleForm(id) {
    const region = this.dicSvc.getRegionById(this.regions, id);
    const regionName = region['name' + this.capitalizeFirstLetter(this.currentLang)];
    this.objectInfoForm.controls.address.setValue(regionName);
  }

  isServiceBezTorgReg() {
    const listSubId = [107, 108];
    return listSubId.includes(this.app.subservice.id);
  }

  isZuPl() {
    const listSubId = [130, 131, 132];
    return listSubId.includes(this.app.subservice.id);
  }

  notShowInCity() {
    if (this.app.regionId !== 1) {
      return true;
    }
  }


}

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {app} from '../../shared/models/application.model';
import {dic} from '../../shared/models/dictionary.model';
import {DicApplicationService} from '../../services/dic.application.service';
import {ApiService} from '../../services/api.service';
import {FileService} from '../../services/file.service';
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";

@Component({
  selector: 'app-show-application-accordion',
  templateUrl: './show-application-accordion.component.html',
  styleUrls: ['./show-application-accordion.component.scss']
})
export class ShowApplicationAccordionComponent implements OnInit, OnDestroy {
  @Input() app: app.App;
  appFileCategories: dic.CategoryFiles[] = [];
  step = null;
  nodata = 'нет данных';
  reserveAppFileCategories: dic.CategoryFiles[] = [
    {
      extensions: 'application/pdf',
      id: 92,
      required: false,
      subserviceId: 21,
      title: 'Доверенность',
      titleKk: 'Сенімхат',
      titleRu: 'Доверенность',
      type: 'POWER_OF_ATTORNEY',
      categoryFiles: [],
      categoryFilesUpload: [],
      display: false
    }
  ];
  destroyed$ = new Subject();
  objFormFields = [];
  prospectorServicesIds = [137, 136, 138, 139, 140, 141, 142, 143, 144, 145, 146, 135];
  cnServicesIds = [80, 81, 82, 83, 84, 85, 86, 87, 88, 89];
  techObj = [];

  constructor(
    private dicSvc: DicApplicationService,
    private api: ApiService,
    private fileSvc: FileService,
  ) {
  }

  ngOnInit() {
    this.getAppFileCategories();
    this.getFormFields(this.app);
    if (this.app.subservice.id === 152) {
      this.sedTechObj();
    }
  }

  getAppFiles(id: number) {
    this.api.get2(`userapp/${id}/files`)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        if (res) {
          this.app.appFiles = res;
          if (this.appFileCategories.length > 0) {
            this.filterFileCategories();
          }
        }
      });
  }

  private getAppFileCategories() {
    if (!this.app.id) {
      return;
    }
    this.dicSvc.getAppFileCategories(this.app.subservice.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((fileCategories: dic.CategoryFiles[]) => {
        this.getAppFiles(this.app.id);
        this.appFileCategories = fileCategories;
        this.appFileCategories = this.dicSvc.changeAppFileCategories(this.appFileCategories);
        if (this.app.otherApplicant) {
          this.appFileCategories = this.appFileCategories.concat(this.reserveAppFileCategories);
        }
      });
  }

  filterFileCategories() {
    this.appFileCategories.map((i: dic.CategoryFiles) => {
      const fileObj = this.app.appFiles.filter((file) => file.fileCategory === i.type);
      i.categoryFiles = fileObj ? [...i.categoryFiles, ...fileObj] : i.categoryFiles;
    });
  }

  fileSizeToBytes(bytes) {
    return this.fileSvc.correctFileSize(bytes);
  }

  downloadAppFile(id: string) {
    this.fileSvc.downloadFileReq(id);
  }

  notHasCnBlock() {
    const ids = [34, 33, 32, 23, 63];
    return ids.some(id => id === this.app.subservice.id);
  }

  hasCnBlock() {
    const ids = [25, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 50, 34, 33, 32, 23, 63];
    return ids.some(id => id === this.app.subservice.id);
  }

  getFormFields(app) {

    const objFields = [
      {type: 'text', plcaceHolder: 'ObjName', ngModel: app.objectInfo.name, ids: [...this.cnServicesIds, ...[1, 41, 21, 61,
          17, 19, 57, 58, 59, 70, 7, 8, 18, 25, 50, 33, 34, 32, 35,
          12, 90, 105, 121, 133]]},
      {type: 'text', plcaceHolder: 'ObjAddress', ngModel: app.objectInfo.address, ids: [...this.cnServicesIds, ...this.prospectorServicesIds, ...[1, 41, 21, 61,
          17, 19, 57, 58, 59, 70, 7, 8, 18, 23, 25, 50, 33, 34, 32, 35, 77,
          12, 90, 105, 121, 133, 134, 37, 39, 130, 131, 132]]},
      {type: 'text', plcaceHolder: 'PlotLocation', ngModel: app.objectInfo.address, ids: [
          25, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 50, 34, 33, 32, 23, 63, 152]},
      {type: 'text', plcaceHolder: 'NameLandProject', ngModel: app.objectInfo.name, ids: [23]},
      {type: 'text', plcaceHolder: 'ReclamationOfDisturbedLands', ngModel: app.objectInfo.name, ids: [134]},
      {type: 'text', plcaceHolder: 'BuildTimeStandards', ngModel: app.objectInfo.period, ids: [1, 41]},
      {type: 'text', plcaceHolder: 'FloorAmount', ngModel: app.objectInfo.floorsCount, ids: [1, 41, 130, 131, 132]},
      {type: 'text', plcaceHolder: 'SqMeters', ngModel: app.objectInfo.area, ids: [1, 41]},
      {type: 'text', plcaceHolder: 'ApartmentsAmount', ngModel: app.objectInfo.flatsCount, ids: [1, 41]},
      {type: 'text', plcaceHolder: 'RoomsAmount', ngModel: app.objectInfo.roomsCount, ids: [1, 41]},
      {type: 'text', plcaceHolder: 'Designer', ngModel: app.objectInfo.designer, ids: [...[this.prospectorServicesIds], ...[21, 61]]},
      {type: 'text', plcaceHolder: 'CatLicGSL', ngModel: app.objectInfo.licenseCategoryGsl, ids: [21, 61]},
      {type: 'text', plcaceHolder: 'LicNumGSL', ngModel: app.objectInfo.licenseNumberGsl, ids: [21, 61]},
      {type: 'date', plcaceHolder: 'LicDateGSL', ngModel: app.objectInfo.licenseDateGsl, ids: [21, 61]},
      {type: 'number', plcaceHolder: 'NumberKadastr', ngModel: app.objectInfo.cadastreNumber, ids: [...this.prospectorServicesIds,
          ...[17, 19, 57, 58, 59, 77,
          70, 7, 8, 18, 23, 25, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 50, 33, 34, 32, 35, 12, 90, 105, 121, 133, 134, 130, 131, 132]]},
      {type: 'text', plcaceHolder: 'RightToUseZU', ngModel: app.objectInfo.useRight, ids: [107, 111, 118, 114, 116, 117,
          113, 110, 119, 115, 112, 25, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 50, 34, 33, 32, 23, 63, 152]},
      {type: 'text', plcaceHolder: 'SpecialPurpose', ngModel: app.objectInfo.purpose, ids: [107, 111, 118, 114, 116,
          117, 113, 110, 119, 115, 112, 133, 134, 130, 131, 132, 18, 77]},
      {type: 'text', plcaceHolder: 'uzoAndOzo', ngModel: app.objectInfo.uzoOzo, ids: [107, 111, 118, 114,
          116, 117, 113, 110, 119, 115, 112]},
      {type: 'number', plcaceHolder: 'AreaGA', ngModel: app.objectInfo.area, ids: [...this.prospectorServicesIds, ...this.cnServicesIds,
          ...[8, 12, 37, 39, 107, 111, 118, 114, 116, 117, 113, 110, 119, 115, 112, 25,  50, 34, 33, 32, 23, 63, 133, 134,
          130, 131, 132, 77, 152]]},
      {type: 'text', plcaceHolder: 'CultBuilding', ngModel: app.objectInfo.cultBuilding, ids: [8, 12]},
      {type: 'text', plcaceHolder: 'DeveloperProjectForReclamationOfDisturbedLands', ngModel: app.objectInfo.designer, ids: [134]},
      {type: 'text', plcaceHolder: 'FinancingSource', ngModel: app.objectInfo.financingSource, ids: [8, 12]},
      {type: 'text', plcaceHolder: 'BuildingCapacity', ngModel: app.objectInfo.buildingCapacity, ids: [8, 12]},
      {type: 'text', plcaceHolder: 'Religion', ngModel: app.objectInfo.religion, ids: [8, 12]},
      {type: 'text', plcaceHolder: 'Repurposing', ngModel: app.objectInfo.purpose, ids: [12]},
      {type: 'text', plcaceHolder: 'ReasonChangePurpose', ngModel: app.objectInfo.changeReason,
        ids: [25, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 50]},
      {type: 'text', plcaceHolder: 'SpecialPurposeCurrent', ngModel: app.objectInfo.purpose, ids: [37, 39,
          25, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 50, 34, 33, 32, 23, 63]},
      {type: 'text', plcaceHolder: 'SpecialPurposeReq', ngModel: app.objectInfo.purposeRequested, ids: [25, 75,
           80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 50]},
      {type: 'checkbox', plcaceHolder: 'TargSupplement', ngModel: app.objectInfo.additionalPurposeUse, ids: [25, 75,
          80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 50]},
      {type: 'text', plcaceHolder: 'additionalArea', ngModel: app.objectInfo.additionalArea, ids: [25, 75,
           80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 50]},
      {type: 'text', plcaceHolder: 'BasisTitleDocuments', ngModel: app.objectInfo.rightDocsReason, ids: [18]},
      {type: 'text', plcaceHolder: 'StateCertificateNumber', ngModel: app.objectInfo.gosAktNumber, ids: [18]},
      {type: 'text', plcaceHolder: 'AkimsDecisionNumber', ngModel: app.objectInfo.akimDecisionNumber, ids: [18]},
      {type: 'text', plcaceHolder: 'SpecialPurposeZU', ngModel: app.objectInfo.purpose, ids: []},
      {type: 'text', plcaceHolder: 'TypeOfLaw', ngModel: app.objectInfo.landRightType, ids: [133, 77]},
      {type: 'text', plcaceHolder: 'Reason', ngModel: app.objectInfo.reason, ids: []},
      {type: 'text', plcaceHolder: 'Based', ngModel: app.objectInfo.based, ids: [133, 77]},
      {type: 'text', plcaceHolder: 'PurposeOfTheSection', ngModel: app.objectInfo.sectionPurpose, ids: [133, 77]},
      {type: 'text', plcaceHolder: 'RkArticle', ngModel: app.objectInfo.uzoOzo, ids: [133, 134]},
      {type: 'text', plcaceHolder: 'DecisionLocalExecutiveBody', ngModel: app.objectInfo.akimDecisionNumber, ids: [134]},
      {type: 'date', plcaceHolder: 'DecisionLocalExecutiveBody', ngModel: app.objectInfo.akimDecisionDate, ids: [134]},
      {type: 'text', plcaceHolder: 'identDocNumber', ngModel: app.objectInfo.identDocNumber,
        ids: [25, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 50]},
      {type: 'date', plcaceHolder: 'identDocDate', ngModel: app.objectInfo.identDocDate,
        ids: [25, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 50]},
      {type: 'text', plcaceHolder: 'legalDocNumber', ngModel: app.objectInfo.legalDocNumber,
        ids: [25, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 50]},
      {type: 'date', plcaceHolder: 'legalDocDate', ngModel: app.objectInfo.legalDocDate,
        ids: [25, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 50]},
      {type: 'text', plcaceHolder: 'SurveyWorkType', ngModel: app.objectInfo.surveyWorkType, ids: [...this.prospectorServicesIds, []]},
      {type: 'text', plcaceHolder: 'SurveyWorkPurpose', ngModel: app.objectInfo.surveyWorkPurpose, ids: [...this.prospectorServicesIds, []]},
      {type: 'text', plcaceHolder: 'SurveyWorkReason', ngModel: app.objectInfo.surveyWorkReason, ids: [...this.prospectorServicesIds, []]},
      {type: 'text', plcaceHolder: 'LandType', ngModel: app.objectInfo.landType, ids: [...this.prospectorServicesIds, []]},
      {type: 'text', plcaceHolder: 'Term', ngModel: app.objectInfo.term, ids: [...this.prospectorServicesIds, []]},
      {type: 'text', plcaceHolder: 'NumberCopiesDisturbedLandReclamationProject', ngModel: app.objectInfo.copyCount, ids: [134]},
      {type: 'text', plcaceHolder: 'WorkSchedule', ngModel: app.objectInfo.workSchedule, ids: [...this.prospectorServicesIds, []]},
      {type: 'text', plcaceHolder: 'LandCodeRK', ngModel: app.objectInfo.uzoOzo, ids: [...this.prospectorServicesIds, [77]]},

      {type: 'text', plcaceHolder: 'FunctionalPurpose', ngModel: app.objectInfo && app.objectInfo.funcUse &&
       app.objectInfo.funcUse.nameRu, ids: [152]},
      {type: 'text', plcaceHolder: 'LandCategory', ngModel: app.objectInfo.landCategory ?
      app.objectInfo.landCategory.nameRu : '', ids: [152]},
      {type: 'text', plcaceHolder: 'IdentifierOfThePlot', ngModel: app.objectInfo.zuId || '', ids: [152]},
    ];

    if (app) {
      for (const iterator of objFields) {
        iterator.ids.forEach(id => {
          if (id === app.subservice.id) {
            this.objFormFields.push(iterator);
          }
        });
      }
    }
  }

  hasTuFile() {
    if (this.app.appFiles ) {
      return this.app.appFiles.some(file => file.fileCategory === 'OWN_TU_SPECIFICATIONS');
    }
  }


  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  isZuPl() {
    return [130, 131, 132].includes(this.app.subservice.id);
  }

  sedTechObj() {
    this.techObj.push(
      { tr: 'ReqPower', val: this.app.electricInfo.requiredPower },
      { tr: 'onePhaseElecSem', val: this.app.electricInfo.onePhaseElecSem },
      { tr: 'threePhaseElecSem', val: this.app.electricInfo.threePhaseElecSem },
      { tr: 'telephoneSem', val: this.app.electricInfo.telephoneSem },
      { tr: 'totalSem', val: this.app.waterInfo.totalSem },
      { tr: 'hourDrinkSem', val: this.app.waterInfo.hourDrinkSem },
      { tr: 'hourIndustrialSem', val: this.app.waterInfo.hourIndustrialSem },
      { tr: 'waterDisposalSem', val: this.app.waterInfo.waterDisposalSem },
      { tr: 'centralHotWaterSem', val: this.app.waterInfo.centralHotWaterSem },
      { tr: 'centralSewerageSem', val: this.app.sewerageInfo.centralSewerageSem },
      { tr: 'centralHeatingSem', val: this.app.heatInfo.centralHeatingSem },
      { tr: 'gazificationSem', val: this.app.gasInfo.gazificationSem }
    );
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}

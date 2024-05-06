import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProblemService } from '../../../services/problem.service';
import { ApplicationService } from '../../../services/application.service';
import { AuthService } from '../../../services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { EditorService } from '../../../services/editor.service';
import { FileService } from '../../../services/file.service';
import { BaseSpecialistComponent } from '../../../departments/architecture/base-specialist/base-specialist.component';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { ListParallelComponent } from 'src/app/components/service-components/list-parallel/list-parallel.component';
import { AuctionDataFormComponent } from '../auction-data-form/auction-data-form.component';
import { dic } from 'src/app/shared/models/dictionary.model';
import { DetermineDivisibilityComponent } from '../determine-divisibility.component';

@Component({
  selector: 'app-bez-torg-reg-study',
  templateUrl: './bez-torg-reg-study.component.html',
  styleUrls: ['./bez-torg-reg-study.component.scss']
})
export class BezTorgRegStudyComponent extends BaseSpecialistComponent implements OnInit, AfterViewChecked {

  listComFileCategory = ['TECH_CONDITION_WATER', 'TECH_CONDITION_TEPLO', 'TECH_CONDITION_GAS',
  'TECH_CONDITION_KAZAHTELECOM', 'TECH_CONDITION_ENERGO', 'TECH_CONDITION_TRANSTELECOM',
  'TECH_CONDITION_OZO', 'TECH_CONDITION_BAIZAKSU', 'TECH_CONDITION_IGILIK', 'TECH_CONDITION_MERKISU',
  'TECH_CONDITION_KORDAISU', 'TECH_CONDITION_AKSUKORDAI', 'TECH_CONDITION_JANATASSUJYLU', 'TECH_CONDITION_ZHES',
  'TECH_CONDITION_ZHAMBYL_SU', 'TECH_CONDITION_ZHAMBYL_ZHYLU'];
  checkFileType;
  disableOnSend = 0;
  intgnInfo: dic.IntegrationInfo;
  auctionData;

  constructor(
    public route: ActivatedRoute,
    public taskService: ProblemService,
    public appSvc: ApplicationService,
    public api: ApiService,
    public authService: AuthService,
    public translate: TranslateService,
    public editorSvc: EditorService,
    public fileSvc: FileService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    super(route, taskService, appSvc, authService, translate, editorSvc, fileSvc);
  }

  ngOnInit() { super.ngOnInit(); }

  setTemplate(template) { this.setTemplateToMessage(template); }

  communalFileCategory(orgCode) { return this.taskService.communalFileCategory(orgCode); }

  isApprovalSheet() { if (this.isSubId([152])) { return this.dataTaskDecide.order > 27; } }

  isFinalAct() {
    if (this.isSubId([107])) { return [46].includes(+this.dataTaskDecide.order); }
  }

  isRegKanc() {
    if (this.isSubId([107])) { return [9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45].includes(+this.dataTaskDecide.order); }
    if (this.isSubId([152])) { return [6, 9, 12, 15, 18, 21, 24, 34].includes(+this.dataTaskDecide.order); }
  }

  isTemplates() {
    if (this.isSubId([107])) { return [3, 5, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37, 40, 43].includes(+this.dataTaskDecide.order); }
    if (this.isSubId([152])) { return [4, 7, 10, 13, 16, 19, 22, 27].includes(+this.dataTaskDecide.order); }
  }

  isOpenListParallel() {
    if (this.isSubId([107])) { return [5].includes(+this.dataTaskDecide.order); }
    if (this.isSubId([152])) { return [4].includes(+this.dataTaskDecide.order); }
  }

  isEditor() {
    this.giveTitleValue();
    if (this.isSubId([107])) { return ![1, 2, 46, 47, 48].includes(+this.dataTaskDecide.order); }
    if (this.isSubId([152])) { return ![1, 2, 3, 6, 25, 26].includes(+this.dataTaskDecide.order); }
  }

  ngAfterViewChecked() {
    const app = this.appSvc.getApp();
    if (!this.checkFileType && this.dataTaskDecide.order > 6 && app.files && app.files.length > 0) {
      const comFiles = app.files.filter((f) => this.listComFileCategory.includes(f.fileCategory));
      if (comFiles.length > 0) {
        comFiles.forEach(v => { this.addFileCategory(v.fileCategory); });
        this.checkFileType = true;
      }
    }
    const checkFileType = this.appFileCategories.some(f => f.type === this.communalFileCategory(this.dataTaskDecide.orgCode));
    if (!checkFileType && this.dataTaskDecide.order > 6) {
      const comFileCategory = this.communalFileCategory(this.dataTaskDecide.orgCode);
      this.addFileCategory(comFileCategory);
    }
    if (this.isSubId([107])) {
      const checkActFinal = this.appFileCategories.some(f => f.type === 'ACT_FINAL');
      if (!checkActFinal && this.dataTaskDecide.order > 45) {
        this.addFileCategory('ACT_FINAL');
      }
      const checkPreliminaryAct = this.appFileCategories.some(f => f.type === 'ACT_REJECT' || f.type === 'ACT_APPROVE');
      if (!checkPreliminaryAct && this.dataTaskDecide.order > 5) { this.addFileCategory('ACT_APPROVE'); }
      const checkZK = this.appFileCategories.some(f => f.type === 'CN_ACT');
      if (!checkZK && this.dataTaskDecide.order > 47) { this.addFileCategory('CN_ACT'); }
    }

    if (this.isSubId([152])) {
      const iskActFinalMerged = this.appFileCategories.some(f => f.type === 'ACT_FINAL_MERGED');
      if (!iskActFinalMerged && this.dataTaskDecide.order > 24) {
        this.addFileCategory('ACT_FINAL_MERGED');
      }
      const checkFilePost = this.appFileCategories.some(f => f.type === 'RESULT_POST');
      if (!checkFilePost && this.dataTaskDecide.order > 32) { this.addFileCategory('RESULT_POST'); }
    }
  }

  genRegNumberAndDate() {
    if (this.isSubId([152]) && [6].includes(+this.dataTaskDecide.order)) {
      this.appSvc.generateRegistrationNumber(this.app.id, {
        numeration: this.dataTaskDecide.number,
        numerationDate: this.dataTaskDecide.date,
        approved: this.task.content.approved
      }).toPromise().then(res => { this.fileComponent.getAppFiles(this.app.id); });
    } else {
      this.appSvc.genRegNumberFileCategory(this.app.id,
        { numeration: this.dataTaskDecide.number, numerationDate: this.dataTaskDecide.date },
        [34].includes(+this.dataTaskDecide.order) ? 'RESULT_POST' : this.communalFileCategory(this.dataTaskDecide.orgCode)).toPromise()
        .then(res => { this.fileComponent.getAppFiles(this.app.id); });
    }
  }

  giveTitleValue() {
    if (this.dataTaskDecide.orgCode) {
      this.titleVal = this.dataTaskDecide.orgCode; this.textVal = this.dataTaskDecide[this.dataTaskDecide.orgCode + 'Text'];
    }
    if (this.isSubId([107])) {
      if ([3, 4].includes(+this.dataTaskDecide.order)) { this.titleVal = 'ozoMessage'; this.textVal = this.dataTaskDecide.ozoMessage; }
      if ([5, 6].includes(+this.dataTaskDecide.order)) { this.titleVal = 'actText'; this.textVal = this.dataTaskDecide.archMessage; }
    }
    if (this.isSubId([152])) {
      if ([4, 5].includes(+this.dataTaskDecide.order)) { this.textVal = this.dataTaskDecide.message; }
      if ([27, 28, 29, 30, 31, 32, 33, 34, 35].includes(+this.dataTaskDecide.order)) {
        this.titleVal = 'orderText'; this.textVal = this.dataTaskDecide.orderText;
      }
    }
  }

  openListParallel() {
    const dialogRef = this.dialog.open(ListParallelComponent, { width: '900px',  height: '600px',
    data: { dataTaskDecide: this.dataTaskDecide } });
    dialogRef.afterClosed().toPromise().then((result: any) => {
      if (result) { this.snackBar.open('Пользователи выбраны!', '', { duration: 3000 }); }
    });
  }

  genFinalAct() {
    this.appSvc.generateFinalAct(this.app.id, {}).toPromise().then(res => {
      this.fileComponent.getAppFiles(this.app.id);
      this.getTaskById();
      this.snackBar.open('Успешно!', '', { duration: 3000 });
    });
  }

  auctionAddressData() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '700px',
    dialogConfig.maxHeight = '600px',
    dialogConfig.data = this.app;
    const dialogRef = this.dialog.open(AuctionDataFormComponent, dialogConfig);
    dialogRef.afterClosed().toPromise().then(res => { res ? this.auctionData = res : this.auctionData = {}; });
  }

  isActResultEgkn() {
    return !this.dataTaskDecide.actResult && this.dataTaskDecide.order == 25 ||
      this.dataTaskDecide.actResult && this.dataTaskDecide.order == 35;
  }

  genFinalActMerged() {
    this.disableOnSend = 1;
    this.appSvc.generateFinalActMerged(this.app.id, {}).toPromise()
      .then(() => { this.fileComponent.getAppFiles(this.app.id); this.snackBar.open('Успешно!', '', { duration: 3000 }); })
      .catch(() => { this.snackBar.open('Ошибка!', '', { duration: 3000 }); })
      .finally(() => { this.disableOnSend = 0; });
  }

  sendEgknMio() {
    this.disableOnSend = 2;
    this.taskService.getIntgnInfo(this.app.id).toPromise().then(res => {
      this.intgnInfo = res;
      this.taskService.sendEgknMio(this.app, this.currentUser, this.intgnInfo).toPromise()
        .then(() => { this.snackBar.open('Успешно', '', { duration: 3000 }); })
        .catch(() => { this.snackBar.open('Ошибка!', '', { duration: 3000 }); })
        .finally(() => { this.disableOnSend = 0; });
    });
  }

  sendActApplicant() {
    this.disableOnSend = 3;
    this.taskService.sendActApplicant(this.app.id).toPromise()
      .then(() => { this.snackBar.open('Успешно', '', { duration: 3000 }); })
      .catch(() => { this.snackBar.open('Ошибка!', '', { duration: 3000 }); })
      .finally(() => { this.disableOnSend = 0; });
  }

  sendAuctionData() {
    if (!this.auctionData) {
      this.snackBar.open('заполните данные аукциона', '', { duration: 3000 });
      return;
     }
    this.taskService.getIntgnInfo(this.app.id).toPromise().then(res => {
      Object.assign(this.auctionData, this.taskService.setIntgnObj(this.app, this.currentUser, res));
      this.auctionData.egknID = this.app.zuId;
      this.auctionData.layerCode = 'AUCTION_LAND';
      this.auctionData.coordinateSystem = '32642';
      this.auctionData.sellerKz = this.auctionData.sellerNameKk;
      this.auctionData.sellerRu = this.auctionData.sellerNameRu;
      this.auctionData.seller = this.auctionData.userInfo;
      this.auctionData.usingLimitKaz = this.auctionData.landLimitsKk;
      this.auctionData.usingLimitRus = this.auctionData.landLimitsRu;
      this.auctionData.ateId = this.auctionData.ateCode;
      this.auctionData.coordinates = this.app.objectInfo.location;
      this.auctionData.funcUse = this.app.objectInfo.funcUse;

      this.taskService.sendAuctionData(this.auctionData).toPromise()
        .then(() => { this.snackBar.open('Успешно', '', { duration: 3000 }); })
        .catch(() => { this.snackBar.open('Ошибка!', '', { duration: 3000 }); })
        .finally(() => { });
    });
  }

  modalDetermine() {
    const dialogRef = this.dialog.open(DetermineDivisibilityComponent, { data: '' });
    dialogRef.afterClosed().toPromise().then((result: any) => {
      if (result) {
        this.app.objectInfo.divisibility = result == 'divisible' ? true : false;
        this.appSvc.updateApp(this.app.id, this.app);
      }
    });
  }

}

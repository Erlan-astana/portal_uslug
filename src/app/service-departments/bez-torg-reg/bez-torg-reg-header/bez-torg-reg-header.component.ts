import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { dic } from '../../../shared/models/dictionary.model';
import { ApplicationService } from '../../../services/application.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ProblemService } from '../../../services/problem.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Location } from '@angular/common';
import { FileService } from '../../../services/file.service';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../../services/api.service';
import { SignService } from '../../../services/sign.service';
import { EditorService } from '../../../services/editor.service';
import { DicApplicationService } from '../../../services/dic.application.service';
import { HeaderArchSpecialistComponent } from '../../../components/header-arch-specialist/header-arch-specialist.component';
import { app } from '../../../shared/models/application.model';
import { STATUSES } from 'src/app/shared/utils/constants';
import ApprovalList = dic.ApprovalList;
import { Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-bez-torg-reg-header',
  templateUrl: './bez-torg-reg-header.component.html',
  styleUrls: ['./bez-torg-reg-header.component.scss']
})
export class BezTorgRegHeaderComponent extends HeaderArchSpecialistComponent implements OnInit, OnDestroy {

  @Output() getApplication = new EventEmitter<number>();
  @Output() refreshResultFiles = new EventEmitter<any>();
  @Input() app: app.App;
  @Input() task: dic.TaskData;
  @Input() sectionId;
  @Input() templates: any;
  listCommunal = [];
  tempComRefusal = false;
  dataSource = [];
  displayedColumns = ['orgNameRu', 'status', 'startDate', 'endDate'];
  statuses = STATUSES;
  approvalList: ApprovalList = new ApprovalList();
  approvalListSubscription: Subscription;
  disableOnSend = 0;
  intgnInfo: dic.IntegrationInfo;

  appInternalFiles: any[] = [
    {
      extensions: 'application/pdf',
      id: 555,
      required: true,
      subserviceId: 21,
      title: '',
      titleRu: '',
      titleKk: '',
      type: 'INTERNAL_FILES',
      categoryFiles: [],
      categoryFilesUpload: [],
      display: false
    }
  ];

  constructor(
    public appSvc: ApplicationService,
    public dialog: MatDialog,
    public taskService: ProblemService,
    public router: Router,
    public authService: AuthService,
    public location: Location,
    public fileServise: FileService,
    public translate: TranslateService,
    public api: ApiService,
    public signService: SignService,
    public snackBar: MatSnackBar,
    public editorSvc: EditorService,
    public dicSvc: DicApplicationService,
  ) {
    super(appSvc, dialog, taskService, router, authService, location, fileServise, translate,
      api, signService, snackBar, editorSvc, dicSvc);
    this.approvalListSubscription = this.taskService.getApprovalList()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(list => {
        this.approvalList = list;
      });
  }

  ngOnInit() {
    super.ngOnInit();
    this.setListCommunal();
    if (this.dataTaskDecide.orgCode) { this.initComCheckBox(); }
    if (this.isListCommunals() && this.app.id) { this.getSentCommunals(); }
 }

 next() {
   if (this.isSubId([152]) && this.dataTaskDecide.order == 6) {
     this.disableOnSend = 1;
     this.taskService.getIntgnInfo(this.app.id).toPromise().then(res => {
       this.intgnInfo = res;
       this.taskService.sendEgkn(this.app, this.currentUser, this.intgnInfo).toPromise().then(() => {
         this.verificationBeforeApproval();
         this.snackBar.open('Успешно передано в НАО', '', { duration: 3000 });
       }).catch(() => {
         this.snackBar.open('Ошибка!', '', { duration: 3000 });
       }).finally(() => { this.disableOnSend = 0; });
     });
   } else {
     this.verificationBeforeApproval();
   }
}

  verificationBeforeRefusal() { this.setValueStage(false).then(() => { this.refusal(); }); }

  signAndCompleteLandLeaseExten() { this.setValueStage(true); this.getSignXml(); this.transferTaskToSend = true; }

  getSentCommunals() { this.api.get2(`userapp/${this.app.id}/appOrgs`).subscribe(res => { this.dataSource = res; }); }

  isResolutionText() { if (this.isSubId([152])) { return [3, 4].includes(+this.dataTaskDecide.order); } }

  isListCommunals() {
    if (this.isSubId([107])) { return [46].includes(+this.dataTaskDecide.order); }
    if (this.isSubId([152])) { return [25].includes(+this.dataTaskDecide.order); }
  }

  showRefusal() {
    if (this.isSubId([107])) { return this.dataTaskDecide.order < 5; }
    if (this.isSubId([152])) { return this.dataTaskDecide.order < 7; }
  }

  isRework() {
    if (this.isSubId([107])) { return [4, 6, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38, 41, 44].includes(+this.dataTaskDecide.order); }
    if (this.isSubId([152])) { return [5, 8, 11, 14, 17, 20, 23, 28, 29, 30, 31, 32].includes(+this.dataTaskDecide.order); }
  }

  showRefusalCom() {
    if (this.isSubId([107])) { return this.dataTaskDecide.order > 6 && this.dataTaskDecide.order < 46; }
    if (this.isSubId([152])) { return this.dataTaskDecide.order > 6 && this.dataTaskDecide.order < 25; }
  }

  checkboxDisabledCom() {
    if (this.isSubId([107])) { return ![7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37, 40, 43].includes(+this.dataTaskDecide.order); }
    if (this.isSubId([152])) { return ![7, 10, 13, 16, 19, 22].includes(+this.dataTaskDecide.order); }
  }

  public verificationBeforeApproval() {
    if (this.isSubId([107, 152]) && this.dataTaskDecide.order > 6) { this.setComCheckBox(); }
    this.setValueStage(true).then(() => { this.approved(); });
  }

  setValueStage(value: boolean) {
    if (this.isSubId([152])) {
      if ([5].includes(+this.dataTaskDecide.order)) { this.dataTaskDecide.prelim_agreed = value; }
      switch (+this.dataTaskDecide.order) {
        case 8: this.dataTaskDecide.gas_agreed = value; break;
        case 11: this.dataTaskDecide.water_agreed = value; break;
        case 14: this.dataTaskDecide.heat_agreed = value; break;
        case 17: this.dataTaskDecide.energy_agreed = value; break;
        case 20: this.dataTaskDecide.kazakhtelecom_agreed = value; break;
        case 23: this.dataTaskDecide.transtelecom_agreed = value; break;
      }
    }
    if (this.isSubId([107])) {
      switch (+this.dataTaskDecide.order) {
        case 4: this.dataTaskDecide.agreed = value; break;
        case 6: this.dataTaskDecide.arch_agreed = value; break;
        case 8: this.dataTaskDecide.gas_agreed = value; break;
        case 11: this.dataTaskDecide.water_agreed = value; break;
        case 14: this.dataTaskDecide.heat_agreed = value; break;
        case 17: this.dataTaskDecide.energy_agreed = value; break;
        case 20: this.dataTaskDecide.kazakhtelecom_agreed = value; break;
        case 23: this.dataTaskDecide.transtelecom_agreed = value; break;
        case 26: this.dataTaskDecide.ozo_agreed = value; break;
        case 29: this.dataTaskDecide.baizak_agreed = value; break;
        case 32: this.dataTaskDecide.merke_agreed = value; break;
        case 35: this.dataTaskDecide.igilik_agreed = value; break;
        case 38: this.dataTaskDecide.janatas_agreed = value; break;
        case 41: this.dataTaskDecide.kordai_agreed = value; break;
        case 44: this.dataTaskDecide.aksu_agreed = value; break;
      }
    }

    return new Promise((resolve) => {
      Object.keys(this.approvalList).forEach((key) => { if (this.approvalList[key]) { this.dataTaskDecide[key] = value; }});
      resolve();
    });
  }

  setListCommunal() {
    this.listCommunal = [
      { name: 'kazahtelecom', ch: this.dataTaskDecide.kazahtelecomApproved },
      { name: 'gas', ch: this.dataTaskDecide.gasApproved },
      { name: 'energo', ch: this.dataTaskDecide.energoApproved },
      { name: 'transtelecom', ch: this.dataTaskDecide.transtelecomApproved },
      { name: 'TazaSu', ch: this.dataTaskDecide.TazaSuApproved },
      { name: 'KulanEnergoJylu', ch: this.dataTaskDecide.KulanEnergoJyluApproved },
      { name: 'ozo', ch: this.dataTaskDecide.ozoApproved },
      { name: 'BaizakSu', ch: this.dataTaskDecide.BaizakSuApproved },
      { name: 'Igilik', ch: this.dataTaskDecide.IgilikApproved },
      { name: 'KordaiSu', ch: this.dataTaskDecide.KordaiSuApproved },
      { name: 'AksuKordai', ch: this.dataTaskDecide.AksuKordaiApproved },
      { name: 'JanatasSuJylu', ch: this.dataTaskDecide.JanatasSuJyluApproved },
      { name: 'MerkeSu', ch: this.dataTaskDecide.MerkeSuApproved },
      { name: 'water_zhambyl_su', ch: this.dataTaskDecide.water_zhambyl_suApproved },
      { name: 'teplo_zhambyl_zhylu', ch: this.dataTaskDecide.teplo_zhambyl_zhyluApproved },
      { name: 'energo_zhes', ch: this.dataTaskDecide.energo_zhesApproved },
    ];
  }

  initComCheckBox() {
    this.listCommunal.forEach(el => {
      if (this.checkboxDisabledCom() && this.dataTaskDecide.orgCode == el.name) { this.tempComRefusal = !el.ch; }
    });
  }

  setComCheckBox() {
    if (this.dataTaskDecide.orgCode) {
      this.dataTaskDecide[this.dataTaskDecide.orgCode + 'Approved'] = !this.tempComRefusal;
    }
  }

  ngOnDestroy() {
    this.approvalListSubscription.unsubscribe();
  }

}

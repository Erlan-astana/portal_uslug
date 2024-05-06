import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

@Component({
  selector: 'app-zu-pl-header',
  templateUrl: './zu-pl-header.component.html',
  styleUrls: ['./zu-pl-header.component.scss']
})
export class ZuPlHeaderComponent extends HeaderArchSpecialistComponent implements OnInit {

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
  }

  ngOnInit() {
    super.ngOnInit();
    this.setListCommunal();
    if (this.dataTaskDecide.orgCode) { this.initComCheckBox(); }
    if (this.dataTaskDecide.order == 24 && this.app.id) {
      this.getSentCommunals();
    }
 }

  showRefusal() { return this.dataTaskDecide.order < 6; }

  isRework() { return this.dataTaskDecide.code === 'REWORK'; }

  showRefusalCom() { return this.dataTaskDecide.order > 5 && this.dataTaskDecide.order < 24; }

  checkboxDisabledCom() {
    return ![6, 9, 12, 15, 18, 21].includes(+this.dataTaskDecide.order);
  }

  public verificationBeforeApproval() {
    if (this.dataTaskDecide.order > 5) { this.setComCheckBox(); }
    this.setValueStage(true);
    this.approved();
  }

  verificationBeforeRefusal() {
    this.setValueStage(false);
    this.refusal();
  }

  signAndCompleteLandLeaseExten() {
    this.setValueStage(true);
    this.getSignXml();
    this.transferTaskToSend = true;
  }

  setValueStage(value: boolean) {
    switch (this.dataTaskDecide.role) {
      case'OTVOD_ARCH_HEAD': case'CONDOMINIUM_ARCH_HEAD': case'PRISTR_ARCH_HEAD': this.dataTaskDecide.agreed = value; break;
      case'OTVOD_GAS_SIGN': case'CONDOMINIUM_GAS_SIGN': case'PRISTR_GAS_SIGN': this.dataTaskDecide.gas_agreed = value; break;
      case'OTVOD_ENERGO_SIGN': case'CONDOMINIUM_ENERGO_SIGN': case'PRISTR_ENERGO_SIGN': this.dataTaskDecide.energy_agreed = value; break;
      // tslint:disable-next-line:max-line-length
      case'OTVOD_KAZAKHTELECOM_SIGN': case'CONDOMINIUM_KAZAKHTELECOM_SIGN': case'PRISTR_KAZAKHTELECOM_SIGN': this.dataTaskDecide.kazakhtelecom_agreed = value; break;
      // tslint:disable-next-line:max-line-length
      case'OTVOD_TRANSTELECOM_SIGN': case'CONDOMINIUM_TRANSTELECOM_SIGN': case'PRISTR_TRANSTELECOM_SIGN': this.dataTaskDecide.transtelecom_agreed = value; break;
      case'OTVOD_SU_SIGN': case'CONDOMINIUM_SU_SIGN': case'PRISTR_SU_SIGN': this.dataTaskDecide.water_agreed = value; break;
      case'OTVOD_ZHYLU_SIGN': case'CONDOMINIUM_ZHYLU_SIGN': case'PRISTR_ZHYLU_SIGN': this.dataTaskDecide.teplo_agreed = value; break;
    }
  }

  initComCheckBox() {
    this.listCommunal.forEach(el => {
      if (this.checkboxDisabledCom() && this.dataTaskDecide.orgCode == el.name) {
        this.tempComRefusal = !el.ch;
      }
    });
  }

  setListCommunal() {
    this.listCommunal = [
      { name: 'gas', ch: this.dataTaskDecide.gasApproved },
      { name: 'kazahtelecom', ch: this.dataTaskDecide.kazahtelecomApproved },
      { name: 'transtelecom', ch: this.dataTaskDecide.transtelecomApproved },
      { name: 'energo_zhes', ch: this.dataTaskDecide.energo_zhesApproved },
      { name: 'water_zhambyl_su', ch: this.dataTaskDecide.water_zhambyl_suApproved },
      { name: 'teplo_zhambyl_zhylu', ch: this.dataTaskDecide.teplo_zhambyl_zhyluApproved }
    ];
  }

  setComCheckBox() {
    if (this.dataTaskDecide.orgCode) {
      this.dataTaskDecide[this.dataTaskDecide.orgCode + 'Approved'] = !this.tempComRefusal;
    }
  }

  getSentCommunals() {
    this.api.get2(`userapp/${this.app.id}/appOrgs`).toPromise().then((res => {
      this.dataSource = res;
    }));
  }

}


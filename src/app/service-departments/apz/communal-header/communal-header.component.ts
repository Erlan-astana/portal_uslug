import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {HeaderArchSpecialistComponent} from '../../../components/header-arch-specialist/header-arch-specialist.component';
import {ApplicationService} from '../../../services/application.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ProblemService} from '../../../services/problem.service';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {Location} from '@angular/common';
import {FileService} from '../../../services/file.service';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from '../../../services/api.service';
import {SignService} from '../../../services/sign.service';
import {EditorService} from '../../../services/editor.service';
import {app} from '../../../shared/models/application.model';
import {dic} from '../../../shared/models/dictionary.model';
import {DicApplicationService} from '../../../services/dic.application.service';
import {AdminService} from '../../../services/admin.service';
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-communal-header',
  templateUrl: './communal-header.component.html',
  styleUrls: ['./communal-header.component.scss']
})
export class CommunalHeaderComponent extends HeaderArchSpecialistComponent implements OnInit, OnDestroy {
  @Output() getApplication = new EventEmitter<number>();
  @Output() saveConnections = new EventEmitter();
  @Output() handleFileInput = new EventEmitter<any>();
  @Input() app: app.App;
  @Input() isSpecial;
  @Input() task: dic.TaskData;
  @Input() sectionId;
  headSpr: boolean = null;
  headPto: boolean = null;
  headRecom: boolean = null;
  subserviceId: any;
  headInsTeplo: boolean = null;
  taskRoleName: string = '';

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
    public adminService: AdminService
  ) {
    super(appSvc, dialog, taskService, router, authService, location, fileServise, translate, api,
      signService, snackBar, editorSvc, dicSvc);
  }

  ngOnInit() {
    super.ngOnInit();
    this.subserviceId = this.task.content.subserviceId;
    this.initXmlUrl();
    this.getUserRoles();

  }

  getUserRoles() {
    if (this.currentUser) {
      this.adminService.getUserRoles(this.currentUser.username)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(res => {
          this.taskRoleName = this.dataTaskDecide.role;
          this.checkOnSpecificRoles(res);
        });
    }
  }

  checkOnSpecificRoles(members) {
    if (this.task.content.subserviceId === 31) {
      this.checkOnSpecificWaterUserRoles(members);
    }

    if ([123, 120, 125, 122, 121].some(id => this.dataTaskDecide.subserviceId === id)) {
      this.checkOnSpecificWaterRegUserRoles(members);
    }

    if (this.task.content.subserviceId === 32) {
      this.checkOnSpecificJarykUserRoles(members);
    }
    if (this.task.content.subserviceId === 35) {
      this.checkOnSpecificTeploUserRoles(members);
    }
    if (this.task.content.subserviceId === 38) {
      this.checkOnSpecificGasUserRoles(members);
    }
    if (this.task.content.subserviceId === 90) {
      this.checkOnSpecificJarykRegUserRoles(members);
    }
  }

  public checkOnSpecificJarykUserRoles(members) {
    if (this.taskRoleName === 'JARYK_HEAD_SPR') {
      this.headSpr = members.some(roles => roles.role.name === 'JARYK_HEAD_SPR');
    }

    if (this.taskRoleName === 'JARYK_EXECUTOR') {
      this.isHead = members.some(roles => roles.role.name === 'JARYK_EXECUTOR');
    }
  }

  public checkOnSpecificJarykRegUserRoles(members) {
    if (this.taskRoleName === 'TUJARYK_HEAD') {
      this.isHead = members.some(roles => roles.role.name === 'TUJARYK_HEAD');
    }
  }


  public checkOnSpecificWaterUserRoles(members) {
    if (this.taskRoleName === 'TU_SUARNASY_EXECUTOR') {
      this.isHead = members.some(roles => roles.role.name === 'TU_SUARNASY_EXECUTOR');
    }
  }

  public checkOnSpecificWaterRegUserRoles(members) {
    if (this.taskRoleName === 'SU_HEAD') {
      this.isHead = members.some(roles => roles.role.name === 'SU_HEAD');
    }
    if (this.taskRoleName === 'SU_HEAD2') {
      this.isHead = members.some(roles => roles.role.name === 'SU_HEAD2');
    }
    if (this.taskRoleName === 'SU_EXECUTOR' && this.dataTaskDecide.subserviceId === 122) {
      this.isHead = members.some(roles => roles.role.name === 'SU_EXECUTOR');
    }
  }

  public async checkOnSpecificTeploUserRoles(members) {
    if (this.taskRoleName === 'HEAD_INS_TEPLO') {
      this.headInsTeplo = members.some(roles => roles.role.name === 'HEAD_INS_TEPLO');
    }

    if (this.headInsTeplo) {
      this.isHead = true;
    }
  }

  public checkOnSpecificGasUserRoles(members) {
    if (this.taskRoleName === 'TU_GAS_PTO_HEAD') {
      this.headPto = true;
    }
    if (this.taskRoleName === 'TU_GAS_SERVICE_HEAD' || this.headPto || this.taskRoleName === 'TU_GAS_HEAD') {
      this.isHead = true;
    }
  }

  verificationBeforeApproval() {
    this.saveConnections.emit();
    if (this.subserviceId === 32) {
      this.dataPreparationApprovalJaryk();
    }
    if (this.subserviceId === 35) {
      this.dataPreparationApprovalTeplo();
    }
    if (this.subserviceId === 38) {
      this.dataPreparationApprovalGas();
    }
    if (this.subserviceId === 90) {
      this.dataPreparationApprovalJarykReg();
    }
    this.approved();
  }

  dataPreparationApprovalJaryk() {
    if (this.headSpr) {
      this.dataTaskDecide.spr_agreed = true;
    }
    if (this.taskRoleName === 'JARYK_RECOM_HEAD' && this.headRecom) {
      this.dataTaskDecide.recom_agreed = true;
      this.dataTaskDecide.communalSigned = false;
    }
  }


  dataPreparationApprovalTeplo() {
    if (this.headInsTeplo) {
      this.dataTaskDecide.ins_agreed = true;
    }

  }

  dataPreparationApprovalGas() {
    if (this.taskRoleName === 'TU_GAS_SERVICE_HEAD') {
      this.dataTaskDecide.communalSigned = false;
    }
    if (this.headPto) {
      this.dataTaskDecide.pto_agreed = true;
    }

  }

  dataPreparationApprovalJarykReg() {
    if (this.isRefusal && !this.dataTaskDecide.up5kvt) {
      this.dataTaskDecide.up5kvt = false;
    }
  }


  verificationBeforeRefusal() {
    if (this.subserviceId === 32) {
      this.dataPreparationRefusalJaryk();
    }
    if (this.subserviceId === 35) {
      this.dataPreparationRefusalTeplo();
    }
    if (this.subserviceId === 38) {
      this.dataPreparationRefusalGas();
    }
    this.refusal();
  }

  dataPreparationRefusalJaryk() {
    if (this.hasService('СПР') && this.headSpr) {
      this.dataTaskDecide.spr_agreed = false;
      this.dataTaskDecide.approved = null;
    }
  }

  dataPreparationRefusalTeplo() {
    if (this.headInsTeplo) {
      this.dataTaskDecide.ins_agreed = false;
    }
  }

  dataPreparationRefusalGas() {
    if (this.headPto) {
      this.dataTaskDecide.pto_agreed = false;
    }
  }

  initXmlUrl() {
    if (this.task.content.type === 'SIGN') {
      this.signXmlUrl = `userapp/${this.app.id}/communal/sign/${this.task.content.subserviceId}`;
    }
    this.callbackSign = this.communalAfterSign;
  }

  communalAfterSign(data, dubThis) {
    if (!data.body.signed) {
      dubThis.snackBar.open(data.body.message, '', {duration: 3000});
      dubThis.dataTaskDecide.communalSigned = false;
    } else {
      dubThis.dataTaskDecide.communalSigned = true;
      dubThis.updateTask(dubThis.dataTaskDecide);
      dubThis.callParentMethod();
      dubThis.snackBar.open('Заявка подписана ! ', '', {duration: 3000});
    }
  }

  public rolesHasAccessKvt() {
    const availableRoles = ['TUJARYK_EXECUTOR', 'TUJARYK_HEAD', 'TUJARYK_EXECUTOR2'];
    return availableRoles.some(role => role === this.dataTaskDecide.role);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}

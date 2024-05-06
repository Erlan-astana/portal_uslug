import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {dic} from '../../../shared/models/dictionary.model';
import {app} from '../../../shared/models/application.model';
import App = app.App;
import Decide = dic.Decide;
import {takeUntil} from 'rxjs/operators';
import {AdminService} from '../../../services/admin.service';
import {Subject, Subscription} from 'rxjs';
import {ProblemService} from '../../../services/problem.service';
import {EditorService} from '../../../services/editor.service';
import {FileService} from '../../../services/file.service';
import ApprovalList = dic.ApprovalList;

@Component({
  selector: 'app-approval-sheet',
  templateUrl: './approval-sheet.component.html',
  styleUrls: ['./approval-sheet.component.scss']
})
export class ApprovalSheetComponent implements OnInit, OnDestroy {
  @Input() taskDecide: Decide = new Decide();
  @Input() app: App;
  @Input() task: any;
  @Input() currentUser: any;
  @Input() sectionId: any = null;
  destroyed$ = new Subject();
  approvalList: ApprovalList = new ApprovalList();
  hasAkim: any = false;
  taskDecideSubscription: Subscription;

  constructor(
    private adminService: AdminService,
    private taskService: ProblemService,
    private editorSvc: EditorService,
    private fileSvc: FileService
  ) {
    this.taskDecideSubscription = this.taskService.getTaskDecideSubject()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(taskDecide => {
        this.taskDecide = taskDecide;
      });
  }

  ngOnInit() {
    this.getUserRoles();
  }

  getUserRoles() {
    if (this.currentUser) {
      this.adminService.getUserRoles(this.currentUser.username)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(res => {
          this.checkOnSpecificRoles(res);
        });
    }
  }

  checkOnSpecificRoles(res) {
    const role = this.taskDecide.role;
    if (role === 'CN_AKIMAT_EXECUTOR2' || role === 'IZYSKATELNYI_KANC' || role === 'SALES_EGOV_KANC_LING') {
      this.approvalList.lingual = res.some(roles => roles.role.name === role);
    }
    if (this.hasJuristRole(role)) {
      this.approvalList.jurist = res.some(roles => roles.role.name === role);
    }

    if (this.hasApparatRole(role)) {
      this.approvalList.apparat = res.some(roles => roles.role.name === role);
    }
    if (role === 'CNREG_FINANCE' || role === 'BEZTORGREG_FINANCE' || role === 'IZYSKATREG_FINANCE') {
      this.approvalList.finance = res.some(roles => roles.role.name === role);
    }
    if (role === 'CNREG_ECONOM' || role === 'BEZTORGREG_ECONOM' || role === 'IZYSKATREG_ECONOM') {
      this.approvalList.econom = res.some(roles => roles.role.name === role);
    }
    if (role === 'CNREG_KANC' || role === 'BEZTORGREG_KANC' || role === 'IZYSKATREG_KANC' ) {
      this.approvalList.kanc = res.some(roles => roles.role.name === role);
    }
    if (this.hasZamAkim1Role(role)) {
      this.approvalList.zam1 = res.some(roles => roles.role.name === role);
    }
    if (role === 'CNREG_ZAMAKIM2' || role === 'BEZTORGREG_ZAMAKIM2' || role === 'IZYSKATREG_ZAMAKIM2') {
      this.approvalList.zam2 = res.some(roles => roles.role.name === role);
    }
    if (role === 'CNREG_ZAMAKIM3' || role === 'BEZTORGREG_ZAMAKIM3' || role === 'IZYSKATREG_ZAMAKIM3') {
      this.approvalList.zam3 = res.some(roles => roles.role.name === role);
    }
    if (role === 'CNREG_ARCH' || role === 'BEZTORGREG_ARCH' || role === 'IZYSKATREG_ARCH') {
      this.approvalList.rukarch = res.some(roles => roles.role.name === role);
    }
    if (role === 'CN_ZAMAKIM1' || role === 'SALES_EGOV_ZAMAKIM') {
      this.approvalList.zamakim = res.some(roles => roles.role.name === role);
      this.approvalList.zamakim1 = this.approvalList.zamakim;
    }
    if (role === 'CNREG_PRAV' || role === 'BEZTORGREG_PRAV' || role === 'IZYSKATREG_PRAV') {
      this.approvalList.prav = res.some(roles => roles.role.name === role);
    }
    if (role === 'CNREG_ORG' || role === 'BEZTORGREG_ORG' || role === 'IZYSKATREG_ORG') {
      this.approvalList.org = res.some(roles => roles.role.name === role);
    }
    if (role === 'CNREG_HEAD3' || role === 'BEZTORGREG_HEAD3' || role === 'IZYSKATREG_PRAV_HEAD') {
      this.approvalList.prav_head = res.some(roles => roles.role.name === role);
    }
    if (this.hasHeadOzoRole(role)) {
      this.approvalList.rukozo = res.some(roles => roles.role.name === role);
    }
    if (role === 'CN_AKIM') {
      this.hasAkim = res.some(roles => roles.role.name === role);
    }
    if (role === 'IZYSKATREG_DOC') {
      this.approvalList.doc = res.some(roles => roles.role.name === role);
    }
    if (role === 'IZYSKATREG_ZAMAKIM4') {
      this.approvalList.zam4 = res.some(roles => roles.role.name === role);
    }
    if (role === 'IZYSKATREG_ZAMAKIM5') {
      this.approvalList.zam5 = res.some(roles => roles.role.name === role);
    }
    if (role === 'CNREG_INSPECTOR' || role === 'BEZTORGREG_INSPECTOR' || role === 'IZYSKATREG_INSPECTOR') {
      this.approvalList.inspector = res.some(roles => roles.role.name === role);
    }

    Object.keys(this.approvalList).forEach((key) => {
      if (this.approvalList[key]) {
        this.taskService.sendHeadSubject(true);
        this.taskService.sendApprovalList(this.approvalList);
      }
    });
  }

  public hasHeadOzoRole(taskRole) {
    const roles = ['CN_OZO_HEAD', 'UZP_POST_HEAD', 'CNREG_HEAD2', 'BEZTORGREG_HEAD2', 'IZYSKATREG_HEAD3', 'IZYSKATELNYI_HEAD3',
    'SALES_EGOV_OZO_HEAD_POST'];
    return roles.some(role => role === taskRole);
  }

  public hasJuristRole(taskRole) {
    const roles = ['CN_JURIST', 'CNREG_JURIST', 'UZP_AKIMAT_DOC', 'BEZTORGREG_JURIST', 'IZYSKATREG_JURIST', 'IZYSKATELNYI_JURIST',
    'SALES_EGOV_JURIST'];
    return roles.some(role => role === taskRole);
  }

  public hasApparatRole(taskRole) {
    const roles = ['CN_RUK_APPARAT', 'CNREG_PUKAPPARAT', 'BEZTORGREG_RUKAPPARAT', 'CNREG_RUKAPPARAT', 'UZP_AKIMAT_RUKAPPARAT',
      'BEZTORGREG_PUKAPPARAT', 'IZYSKATREG_RUKAPPARAT', 'IZYSKATELNYI_RUKAPPARAT', 'SALES_EGOV_RUK_APPARAT'];
    return roles.some(role => role === taskRole);
  }

  public hasZamAkim1Role(taskRole) {
    const roles = ['CNREG_ZAMAKIM1', 'UZP_AKIMAT_ZAMAKIM', 'BEZTORGREG_ZAMAKIM1', 'IZYSKATREG_ZAMAKIM1', 'IZYSKATREG_ZAMAKIM', 'IZYSKATELNYI_ZAMAKIM1'];
    return roles.some(role => role === taskRole);
  }

  showApprovalSheetGeneratedFile() {
    const roles = ['CN_REG_EXECUTOR2', 'CNREG_EXECUTOR2', 'BEZTORGREG_EXECUTOR2', 'IZYSKATREG_EXECUTOR2', 'IZYSKATREG_EXECUTOR',
      'IZYSKATELNYI_EXECUTOR2', 'IZYSKATREG_UZO_EXECUTOR', 'SALES_EGOV_AKIM'];
    return roles.some(role => role === this.taskDecide.role);
  }

  downloadApprovalSheetGeneratedFile() {
    const self = this;
    this.fileSvc.downloadApprovalSheetFile(this.app.id, (res) => {
      const file = new File([res], `app-sheet-${new Date().getTime()}.pdf`, {
        lastModified: new Date().getTime(),
        type: res.type
      });

      self.fileSvc.getAddFileSingleReq(file)
        .pipe(takeUntil(this.destroyed$))
        .subscribe((response: any) => {
          const uploadFile = {
            uid: response.uid,
            fileName: response.fileName,
            fileCategory: 'internal',
            size: res.fileSize
          };
          self.taskDecide.internalFiles.push(uploadFile);
          this.updateTask({decide: self.taskDecide});
        });
    });
  }

  updateTask(data: any = null) {
    if (data.decide) {
      this.taskDecide = this.taskService.removeUnnecessaryFieldsFromDecide(this.taskDecide);
      if (data.fileCategory === 'CN_ACT') {
        this.taskDecide.scanFiles = data.decide.scanFiles;
      }
      if (data.fileCategory === 'conclusionForZK') {
        this.taskDecide.zkFiles = data.decide.zkFiles;
      }
      this.taskService.refreshTask(this.task.processInstanceId, this.taskDecide)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(res => {
          this.taskService.sendTaskDecideSubject(res.body);
        });
    }
  }

  downloadApprovalSheetGeneratedDocxFile() {
    this.fileSvc.downloadApprovalSheetDocxFile(this.app.id);
  }

  showCnCheckboxByServiceId() {
    const availableIds = [25, 50, 135, 152];
    return availableIds.some(role => role === this.app.subservice.id);
  }


  showCnRegEconomCheckboxByServiceId() {
    const availableIds = [80, 85, 89, 110, 119, 115, 137, 140, 142, 146];
    return availableIds.some(role => role === this.app.subservice.id);
  }

  showCnRegHeadArchCheckboxByServiceId() {
    const availableIds = [80, 110, 137];
    return availableIds.some(role => role === this.app.subservice.id);
  }

  showCnRegKancCheckboxByServiceId() {
    const availableIds = [80, 82, 83, 84, 85, 86, 87, 88, 89, 118, 116, 113, 110, 119, 115, 112, 137, 136, 138, 140, 142,
      143, 145];
    return availableIds.some(role => role === this.app.subservice.id);
  }

  showBezTorgRegKancCheckboxByServiceId() {
    const availableIds = [114, 139];
    return availableIds.includes(this.app.subservice.id);
  }

  showCnRegJuristCheckboxByServiceId() {
    const availableIds = [81, 111, 118, 117, 144, 145, 146, 141];
    return availableIds.some(role => role === this.app.subservice.id);
  }

  showCnRegInspectorCheckboxByServiceId() {
    const availableIds = [82, 112, 145];
    return availableIds.some(role => role === this.app.subservice.id);
  }

  showCnRegDocCheckboxByServiceId() {
    const availableIds = [146];
    return availableIds.some(role => role === this.app.subservice.id);
  }

  showZamCheckboxByServiceId() {
    return [152].includes(this.app.subservice.id);
  }

  showZam1CheckboxByServiceId() {
    const availableIds = [80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 23, 111, 118, 114, 116, 117, 113, 110, 119, 50, 115, 112,
      135, 137,
      136, 138, 139, 140, 141, 142, 143, 144, 145, 146];
    return availableIds.some(role => role === this.app.subservice.id);
  }

  showZam2CheckboxByServiceId() {
    const availableIds = [80, 82, 83, 84, 85, 86, 87, 89, 116, 117, 113, 110, 119, 50, 115, 112, 137, 136, 138, 139, 140, 141, 142, 145, 146];
    return availableIds.some(role => role === this.app.subservice.id);
  }

  showZam3CheckboxByServiceId() {
    const availableIds = [80, 82, 83, 84, 85, 86, 87, 89, 110, 50, 115, 112, 137, 140, 145, 146];
    return availableIds.some(role => role === this.app.subservice.id);
  }

  showZam4CheckboxByServiceId() {
    const availableIds = [146];
    return availableIds.some(role => role === this.app.subservice.id);
  }

  showZam5CheckboxByServiceId() {
    const availableIds = [146];
    return availableIds.some(role => role === this.app.subservice.id);
  }

  showCnRegOrgCheckboxByServiceId() {
    const availableIds = [87, 117, 141];
    return availableIds.some(role => role === this.app.subservice.id);
  }

  showCnRegPravCheckboxByServiceId() {
    const availableIds = [84, 114, 139];
    return availableIds.some(role => role === this.app.subservice.id);
  }

  showCnRegApparatCheckboxByServiceId() {
    const availableIds = [81, 111, 144];
    return availableIds.some(role => role === this.app.subservice.id);
  }

  ngOnDestroy() {
    this.taskDecideSubscription.unsubscribe();
  }

}

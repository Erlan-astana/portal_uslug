import {AfterViewChecked, Component, OnInit, ViewChild} from '@angular/core';
import {BaseSpecialistComponent} from '../../../departments/architecture/base-specialist/base-specialist.component';
import {CnHeaderComponent} from '../cn-header/cn-header.component';
import {ActivatedRoute} from '@angular/router';
import {ProblemService} from '../../../services/problem.service';
import {ApplicationService} from '../../../services/application.service';
import {AuthService} from '../../../services/auth.service';
import {TranslateService} from '@ngx-translate/core';
import {EditorService} from '../../../services/editor.service';
import {FileService} from '../../../services/file.service';
import {takeUntil} from 'rxjs/operators';
import {AdminService} from '../../../services/admin.service';

@Component({
  selector: 'app-cn-study',
  templateUrl: './cn-study.component.html',
  styleUrls: ['./cn-study.component.scss']
})
export class CnStudyComponent extends BaseSpecialistComponent implements OnInit, AfterViewChecked {
  @ViewChild(CnHeaderComponent, {static: false})
  public headerComponent: CnHeaderComponent;
  headerComponentLoaded: boolean;
  cnArchExecutors = ['CNAUL_ARCH_EXECUTOR', 'CN_ARCH_EXECUTOR', 'CN_ARCH_SPEC', 'UZP_EXECUTOR', 'CNREG_EXECUTOR', 'CNREG_ARCH_EXECUTOR', 'IZYSKATELNYI_EXECUTOR'];
  ozoTemplates: any;
  availableRolesForApprovalSheetBlock = ['CN_OZO_HEAD', 'CN_JURIST', 'CN_AKIMAT_EXECUTOR2', 'CN_RUK_APPARAT',
    'CN_ZAMAKIM1', 'CN_AKIM', 'CN_OZO_EXECUTOR_REG', 'CN_REG_EXECUTOR2',
    'UZP_POST_HEAD', 'UZP_AKIMAT_HEAD', 'UZP_AKIMAT_DOC', 'UZP_AKIMAT_RUKAPPARAT', 'UZP_AKIMAT_ZAMAKIM'];
  availableCnRegRolesForApprovalSheetBlock = ['CNREG_HEAD2', 'CNREG_KANC', 'CNREG_JURIST', 'CNREG_FINANCE',
    'CNREG_ECONOM', 'CNREG_PUKAPPARAT', 'CNREG_RUKAPPARAT', 'CNREG_ZAMAKIM1', 'CNREG_ZAMAKIM2', 'CNREG_ZAMAKIM3',
    'CNREG_ARCH', 'CNREG_EXECUTOR2', 'CNREG_PRAV', 'CNREG_HEAD3', 'CNREG_ORG', 'CNREG_INSPECTOR'];
  availableProspectorRegRolesForApprovalSheetBlock = ['IZYSKATREG_HEAD3', 'IZYSKATREG_KANC', 'IZYSKATREG_JURIST', 'IZYSKATREG_FINANCE',
    'IZYSKATREG_ECONOM', 'IZYSKATREG_RUKAPPARAT', 'IZYSKATREG_ZAMAKIM1', 'IZYSKATREG_ZAMAKIM2', 'IZYSKATREG_ZAMAKIM3', 'IZYSKATREG_ARCH',
    'IZYSKATREG_INSPECTOR', 'IZYSKATREG_ZAMAKIM', 'IZYSKATREG_DOC', 'IZYSKATREG_ORG', 'IZYSKATREG_EXECUTOR', 'IZYSKATREG_PRAV', 'IZYSKATELNYI_HEAD3', 'IZYSKATELNYI_JURIST', 'IZYSKATELNYI_KANC', 'IZYSKATELNYI_RUKAPPARAT', 'IZYSKATELNYI_ZAMAKIM1',
    'IZYSKATELNYI_EXECUTOR2', 'IZYSKATREG_ZAMAKIM4', 'IZYSKATREG_ZAMAKIM5', 'IZYSKATREG_UZO_EXECUTOR', 'IZYSKATREG_EXECUTOR2'];

  constructor(
    public route: ActivatedRoute,
    public taskService: ProblemService,
    public appSvc: ApplicationService,
    public authService: AuthService,
    public translate: TranslateService,
    public editorSvc: EditorService,
    public fileSvc: FileService,
    public adminService: AdminService
  ) {
    super(route, taskService, appSvc, authService, translate, editorSvc, fileSvc);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  public getUserRoles() {
    if (this.authService.currentUser) {
      this.adminService.getUserRoles(this.authService.currentUser.username)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(res => {
          this.checkOnSpecificRoles(res);
        });
    }
  }

  public checkOnSpecificRoles(roles) {
    console.log(roles);
  }

  setTemplate(template) {
    this.headerComponent.isRefusal = !template.approved;
    this.setTemplateToMessage(template);
  }

  ngAfterViewChecked() {
    if (this.headerComponent && !this.headerComponentLoaded) {
      this.headerComponentLoaded = true;
    }
  }

  showChanceryAkimBlockByUserRoles(userRole) {
    return this.taskService.checkTaskRolesForChanceryAkim(userRole);
  }

  showApprovalSheetBlockByUserRoles(userRole) {
    const availableRoles = [...this.availableCnRegRolesForApprovalSheetBlock, ...this.availableRolesForApprovalSheetBlock, ...this.availableProspectorRegRolesForApprovalSheetBlock];
    return availableRoles.some(role => role === userRole);
  }

  showResolutionBlockByUserRoles(userRole) {
    let availableRoles = ['CN_OZO_EXECUTOR', 'UZP_POST_EXECUTOR', 'CNREG_POST', 'IZYSKATREG_POST', 'IZYSKATREG_HEAD2'];
    availableRoles = [...this.availableCnRegRolesForApprovalSheetBlock, ...availableRoles,
      ...this.availableRolesForApprovalSheetBlock, ...this.availableProspectorRegRolesForApprovalSheetBlock];
    return availableRoles.some(role => role === userRole);
  }

  showEditorByUserRoles(taskRole) {
    if (this.dataTaskDecide.role) {
      const availableRoles = [...['CN_ARCH_HEAD', 'UZP_HEAD', 'CNREG_HEAD', 'CNREG_ARCH_HEAD', 'IZYSKATELNYI_HEAD2',
        'IZYSKATELNYI_AKIM'], ...this.cnArchExecutors];
      return availableRoles.some(role => role === taskRole);
    }
  }

  showEditorTemplatesByUserRole(taskRole) {
    if (this.app.subservice.id === 25) {
      this.filterTemplatesByServiceId(taskRole);
    } else {
      this.ozoTemplates = this.templates;
    }
    return this.cnArchExecutors.some(role => role === taskRole);
  }

  filterTemplatesByServiceId(taskRole) {
    if (this.cnArchExecutors.some(role => role === taskRole)) {
      this.ozoTemplates = this.templates.filter(item => item.id === 28);
    } else {
      this.ozoTemplates = this.templates.filter(item => item.id !== 28);
    }
  }

}

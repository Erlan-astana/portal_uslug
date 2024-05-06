import {AfterViewChecked, AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BaseSpecialistComponent} from '../../../departments/architecture/base-specialist/base-specialist.component';
import {ActivatedRoute} from '@angular/router';
import {ProblemService} from '../../../services/problem.service';
import {ApplicationService} from '../../../services/application.service';
import {AuthService} from '../../../services/auth.service';
import {TranslateService} from '@ngx-translate/core';
import {EditorService} from '../../../services/editor.service';
import {FileService} from '../../../services/file.service';
import {ApiService} from '../../../services/api.service';
import {HeaderArchSpecialistComponent} from '../../../components/header-arch-specialist/header-arch-specialist.component';
import {AdminService} from '../../../services/admin.service';
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-apz-study',
  templateUrl: './apz-study.component.html',
  styleUrls: ['./apz-study.component.scss']
})
export class ApzStudyComponent extends BaseSpecialistComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild(HeaderArchSpecialistComponent, {static: false})
  public headerComponent: HeaderArchSpecialistComponent;
  checkRoles: boolean;

  constructor(
    public route: ActivatedRoute,
    public taskService: ProblemService,
    public appSvc: ApplicationService,
    public authService: AuthService,
    public translate: TranslateService,
    public editorSvc: EditorService,
    public fileSvc: FileService,
    private api: ApiService,
    private adminService: AdminService
  ) {
    super(route, taskService, appSvc, authService, translate, editorSvc, fileSvc);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngAfterViewChecked() {
    this.getUserRoles();
  }

  setTemplate(template) {
    this.headerComponent.isRefusal = !template.approved;
    this.setTemplateToMessage(template);
  }

  getUserRoles() {
    if (this.currentUser && this.headerComponent && !this.checkRoles) {
      this.checkRoles = true;
      this.adminService.getUserRoles(this.currentUser.username)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(res => {
          this.checkOnSpecificRoles(res);
        });
    }
  }

  checkOnSpecificRoles(res) {
    const hasHeadApz = res.some(roles => roles.role.name === 'APZ_HEAD' || roles.role.name === 'APZ_REG_HEAD');
    if (hasHeadApz) {
      this.headerComponent.isHead = true;
    }
  }

  hasTuFile() {
    if (this.app.appFiles ) {
      return this.app.appFiles.some(file => file.fileCategory === 'OWN_TU_SPECIFICATIONS');
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    super.ngOnDestroy();
  }


}

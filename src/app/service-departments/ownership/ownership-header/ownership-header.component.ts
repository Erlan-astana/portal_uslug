import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {app} from '../../../shared/models/application.model';
import {dic} from '../../../shared/models/dictionary.model';
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
import {DicApplicationService} from '../../../services/dic.application.service';
import {AdminService} from '../../../services/admin.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-ownership-header',
  templateUrl: './ownership-header.component.html',
  styleUrls: ['./ownership-header.component.scss']
})
export class OwnershipHeaderComponent extends HeaderArchSpecialistComponent implements OnInit {
  @Output() getApplication = new EventEmitter<number>();
  @Output() handleFileInput = new EventEmitter<any>();
  @Input() app: app.App;
  @Input() isSpecial;
  @Input() task: dic.TaskData;
  @Input() sectionId;
  subserviceId: any;

  ownFileCategories: any[] = [
    {
      extensions: 'application/pdf',
      id: 555,
      required: true,
      subserviceId: 25,
      title: 'Электронная копия постановления (решения)',
      type: 'CN_ACT',
      categoryFiles: [],
      categoryFilesUpload: []
    }
  ];
  @Input() templates: any;
  hasArchHead: boolean;
  destroyed$ = new Subject();

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
    public adminService: AdminService,
  ) {
    super(appSvc, dialog, taskService, router, authService, location, fileServise, translate,
      api, signService, snackBar, editorSvc, dicSvc);
  }

  ngOnInit() {
    super.ngOnInit();
    //this.fileCategories = [...this.fileCategories, ...this.ownFileCategories];
    this.getUserRoles();
    this.subserviceId = this.task.content.subserviceId;
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

  checkOnSpecificRoles(members) {
    const role = this.task.content.role;
    const headRoles = ['RS_RUK_RELIGION', 'SALE_HEAD1', 'SALE_HEAD2', 'DEMOLITION_HEAD1', 'DEMOLITION_AKIM',
      'RS_HEAD1', 'PPR_HEAD1', 'PPR_HEAD2', 'RS_HEAD2', 'SALE_REG_HEAD1', 'PPR_RUK_RELIGION'];
    if (headRoles.some(headRole => headRole === role)) {
      this.isHead = true;
    }
  }

  public verificationBeforeApproval() {
    this.clearMessageAfterSign(this.dataTaskDecide.role);
    if (this.dataTaskDecide.subserviceId !== 8) {
      this.setValueToOzoStage(true);
    }
    if (this.task.content.role === 'SALE_EXECUTOR2') {
      this.dataTaskDecide.signedDocument = false;
    }
    this.prepareRsDataToSend(true)
      .then(res => {
        if (res) {
          this.approved();
        }
      });
  }

  public prepareRsDataToSend(val) {
    return new Promise((resolve) => {
      const role = this.dataTaskDecide.role;
      if (role.includes('EXECUTOR') && !this.dataTaskDecide.message) {
        this.snackBar.open('Заполните письмо !', '', {duration: 3000});
        resolve(false);
      }
      if (role.includes('RUK_RELIGION') || role.includes('HEAD1')) {
        this.dataTaskDecide.signedDocument = false;
      }
      resolve(true);
    });
  }

  public verificationBeforeRefusal() {
    this.setValueToOzoStage(false);
    this.prepareRsDataToSend(false)
      .then(res => {
        if (res) {
          this.refusal();
        }
      });
  }

  clearMessageAfterSign(taskRole) {
    const roles = ['RS_HEAD1', 'RS_RUK_RELIGION', 'PPR_HEAD1', 'PPR_RUK_RELIGION'];
    if (roles.some(role => role === taskRole)) {
      this.dataTaskDecide.message = '. ';
    }
  }

  setValueToOzoStage(value: boolean) {
    const code = this.task.content.code;
    const role = this.dataTaskDecide.role;
    if (code === 'check_ruk_ozo') {
      this.dataTaskDecide.rukozo = value;
    }
    if (role === 'DEMOLITION_HEAD1') {
      this.dataTaskDecide.agreed = value;
    }
    if (role === 'DEMOLITION_AKIM') {
      this.dataTaskDecide.akim_agreed = value;
    }
  }

  signXml() {
    if (this.app.subservice.id === 8 || this.app.subservice.id === 12) {
      if (this.dataTaskDecide.role.includes('HEAD1') || this.dataTaskDecide.role.includes('RUK_RELIGION')) {
        this.signXmlUrl = `userapp/${this.app.id}/sign` + '?internal=true';
      }
    }
    this.getSignXml();
  }


}

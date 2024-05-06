import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {HeaderArchSpecialistComponent} from '../../../components/header-arch-specialist/header-arch-specialist.component';
import {app} from '../../../shared/models/application.model';
import {dic} from '../../../shared/models/dictionary.model';
import {Subject, Subscription} from 'rxjs';
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
import {takeUntil} from 'rxjs/operators';
import ApprovalList = dic.ApprovalList;

@Component({
  selector: 'app-cn-header',
  templateUrl: './cn-header.component.html',
  styleUrls: ['./cn-header.component.scss']
})
export class CnHeaderComponent extends HeaderArchSpecialistComponent implements OnInit, OnDestroy {
  @Output() getApplication = new EventEmitter<number>();
  @Output() handleFileInput = new EventEmitter<any>();
  @Input() app: app.App;
  @Input() isSpecial;
  @Input() task: dic.TaskData;
  @Input() sectionId;
  protected unsubscribe$ = new Subject<any>();
  approvalListSubscription: Subscription;
  approvalList: ApprovalList = new ApprovalList();

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
    this.approvalListSubscription = this.taskService.getApprovalList()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(list => {
        this.approvalList = list;
      });
  }

  ngOnInit() {
    super.ngOnInit();
    this.getUserRoles();
  }

  getUserRoles() {
    if (this.currentUser) {
      this.adminService.getUserRoles(this.currentUser.username)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(res => {
          this.checkOnSpecificRoles(res);
        });
    }
  }

  public checkOnSpecificRoles(members) {
    const role = this.dataTaskDecide.role;
    const headRoles = ['CN_ARCH_HEAD', 'UZP_HEAD', 'CNREG_ARCH_HEAD', 'CNREG_HEAD', 'IZYSKATREG_HEAD2', 'IZYSKATELNYI_HEAD2',
      'IZYSKATELNYI_AKIM', 'IZYSKATELNYI_HEAD2'];
    if (headRoles.some(headRole => headRole === role)) {
      this.isHead = members.some(roles => roles.role.name === this.dataTaskDecide.role);
    }
  }


  public verificationBeforeApproval() {
    this.changeHeadFields();
    this.setValueToOzoStage(true).then(() => {
      this.approved();
    });
  }

  public verificationBeforeRefusal() {
    this.changeHeadFields();
    this.setValueToOzoStage(false).then(() => {
      this.refusal();
    });
  }

  changeHeadFields() {
    const headRoles = ['CNREG_ARCH_HEAD', 'CNREG_HEAD'];
    if (headRoles.some(headRole => headRole === this.dataTaskDecide.role)) {
      this.dataTaskDecide.signedDocument = false;
    }
  }

  setValueToOzoStage(value: boolean) {
    return new Promise((resolve) => {
      Object.keys(this.approvalList).forEach((key) => {
        if (this.approvalList[key]) {
          this.dataTaskDecide[key] = value;
        }
      });
      resolve();
    });
  }

  showDecreeCheckbox() {
    if (this.dataTaskDecide.role === 'UZP_EXECUTOR') {
      return true;
    }
  }

  signXml() {
    if (this.dataTaskDecide.role === 'CNREG_HEAD' || this.dataTaskDecide.role === 'CNREG_ARCH_HEAD') {
      this.signXmlUrl = `userapp/${this.app.id}/sign` + '?internal=true';
    }
    this.getSignXml();
  }

  ngOnDestroy() {
    this.approvalListSubscription.unsubscribe();
  }

}

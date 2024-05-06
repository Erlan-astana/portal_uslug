import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {HeaderArchSpecialistComponent} from 'src/app/components/header-arch-specialist/header-arch-specialist.component';
import {AdminService} from 'src/app/services/admin.service';
import {ApiService} from 'src/app/services/api.service';
import {ApplicationService} from 'src/app/services/application.service';
import {AuthService} from 'src/app/services/auth.service';
import {Location} from '@angular/common';
import {DicApplicationService} from 'src/app/services/dic.application.service';
import {EditorService} from 'src/app/services/editor.service';
import {FileService} from 'src/app/services/file.service';
import {ProblemService} from 'src/app/services/problem.service';
import {SignService} from 'src/app/services/sign.service';
import {app} from 'src/app/shared/models/application.model';
import {dic} from 'src/app/shared/models/dictionary.model';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-short-service-header',
  templateUrl: './short-service-header.component.html',
  styleUrls: ['./short-service-header.component.scss']
})
export class ShortServiceHeaderComponent extends HeaderArchSpecialistComponent implements OnInit, OnDestroy {

  @Output() getApplication = new EventEmitter<number>();
  @Output() handleFileInput = new EventEmitter<any>();
  @Input() app: app.App;
  @Input() isSpecial;
  @Input() task: dic.TaskData;
  @Input() sectionId;
  protected unsubscribe$ = new Subject<any>();

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

  checkOnSpecificRoles(members) {
    const roles = ['ADRPRISV_CITY_HEAD', 'ADRPRISV_HEAD', 'ADRUPRAZ_HEAD', 'ADRUTOCH_HEAD', 'REKULTIVACIA_HEAD',
      'DELIMOST_HEAD', 'DELIMOST_HEAD2'];
    if (roles.some(role => role === this.dataTaskDecide.role)) {
      this.isHead = members.some(role => role.role.name === this.dataTaskDecide.role);
    }
  }


  public verificationBeforeApproval() {
    this.approved();
  }

  verificationBeforeRefusal() {
    this.refusal();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

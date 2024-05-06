import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {app} from '../../shared/models/application.model';
import {ApplicationService} from '../../services/application.service';
import {MatDialog, MatDialogConfig, MatSnackBar} from '@angular/material';
import {MessageBoxComponent} from '../message-box/message-box.component';
import {ProblemService} from '../../services/problem.service';
import {dic} from '../../shared/models/dictionary.model';
import Decide = dic.Decide;
import {Router} from '@angular/router';
import {auth} from '../../shared/models/auth.model';
import {AuthService} from '../../services/auth.service';
import {Location} from '@angular/common';

import {FileService} from '../../services/file.service';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from '../../services/api.service';
import {SignService} from '../../services/sign.service';
import {Subject, Subscription} from 'rxjs';
import {EditorService} from '../../services/editor.service';
import {TaskHistoryComponent} from './task-history/task-history.component';
import {AisgzkComponent} from '../aisgzk/aisgzk.component';
import {DicApplicationService} from '../../services/dic.application.service';
import {FilesUploadComponent} from '../files-upload/files-upload.component';
import {Region} from '../select-region/model/region.model';
import {SearchGbdComponent} from './search-gbd/search-gbd.component';
import {takeUntil} from 'rxjs/operators';
import {SelectStorageComponent} from '../select-storage/select-storage.component';

@Component({
  selector: 'app-header-arch-specialist',
  templateUrl: './header-arch-specialist.component.html',
  styleUrls: ['./header-arch-specialist.component.scss'],
})
export class HeaderArchSpecialistComponent implements OnInit, OnDestroy, AfterViewInit {
  @Output() getApplication = new EventEmitter<number>();
  @Output() handleFileInput = new EventEmitter<any>();
  @Input() app: app.App;
  @Input() task: dic.TaskData;
  @Input() sectionId;
  fileCategories: any[] = [
    {
      extensions: 'application/pdf',
      id: 555,
      required: true,
      subserviceId: 21,
      title: 'Внутренние файлы',
      titleRu: 'Внутренние файлы',
      titleKk: 'Ішкі файлдар',
      type: 'internal',
      categoryFiles: [],
      categoryFilesUpload: [],
      display: false
    }
  ];
  appFileCategories: dic.CategoryFiles[] = [
    {
      extensions: 'application/pdf',
      id: 92,
      required: true,
      subserviceId: 25,
      title: 'Внутренние файлы',
      titleRu: 'Внутренние файлы',
      titleKk: 'Ішкі файлдар',
      type: 'INTERNAL_FILES',
      categoryFiles: [],
      categoryFilesUpload: [],
      display: false
    },
    {
      extensions: 'application/pdf',
      id: 92,
      required: true,
      subserviceId: 23,
      title: '',
      titleKk: '',
      titleRu: '',
      type: 'APPLICATION_PDF',
      categoryFiles: [],
      categoryFilesUpload: [],
      display: false
    }
  ];
  dataTaskDecide: dic.Decide = new dic.Decide();
  dialogRef = null;
  taskForRefresh: dic.TaskForRefresh = new dic.TaskForRefresh();
  assignees: auth.User[] = [];
  controller: any = null;
  executor: any = null;
  assignee: any = null;
  currentUser = auth.User = null;
  isHead: boolean;
  isRefusal: boolean = false;
  isSpecial: boolean = true;
  file: dic.CategoryFiles = new dic.CategoryFiles();
  currentLang;
  selectedStorage = 'PKCS12';
  sign;
  subscription: Subscription;
  editorSubscription: Subscription;
  headSubscription: Subscription;
  signXmlUrl: any = null;
  callbackSign?: any = null;
  hasGbdAccess: boolean = false;
  regions: Region[] = [];
  @ViewChild(FilesUploadComponent, {static: false})
  public fileComponent: FilesUploadComponent;
  transferTaskToSend: boolean;
  destroyed$ = new Subject();

  selectStorageServices: Array<number> = [1, 2, 3, 4, 9, 41, 42, 43, 44, 49, 18];
  selectStorageObj = {
    value: '',
    isSelectStorage: false
  };

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
    public dicSvc: DicApplicationService
  ) {
    this.subscription = this.taskService.getTaskDecideSubject()
      .subscribe(taskDecide => {
        this.dataTaskDecide = taskDecide;
        this.fileComponent.setTaskFiles();
      });
    this.editorSubscription = this.editorSvc.getComments()
      .subscribe(comment => {
        this.dataTaskDecide.comments = comment;
      });

    this.headSubscription = this.taskService.getHeadSubject().subscribe(state => {
      this.isHead = state;
    });
    this.currentLang = this.translate.currentLang ? this.translate.currentLang : this.translate.getDefaultLang();

  }

  checkGbdAccessRole() {
    this.hasGbdAccess = this.authService.hasRole('ROLE_GBD_ACCESS');
  }

  ngOnInit() {
    this.translate.onLangChange.pipe(takeUntil(this.destroyed$)).subscribe((event: any) => {
      this.currentLang = event.lang;
    });
    this.getCurrentUser();
    this.getAssignees();
    this.setTaskData();
    this.setTaskDecide();
    this.checkGbdAccessRole();
    this.sign = this.signService.sign$.pipe(takeUntil(this.destroyed$)).subscribe((data: any) => {
      if (data.callback === `${this.app.id}_signXmlBack`) {
        this.signXmlBack(data.result, this.callbackSign);
      }
    });
  }

  ngAfterViewInit() {
    this.getRegions();
  }

  setTaskData() {
    if (this.task.content) {
      this.isRefusal = this.task.content.approved === null || this.task.content.approved === undefined ?
        false : !this.task.content.approved;
    }
    if (this.task.content.executor) {
      this.executor = this.task.content.executor;
    }
    if (this.task.content.control) {
      this.controller = [this.task.content.control];
    }
    if (!this.task.content.appId) {
      this.controller = this.app.control;
      this.executor = this.app.currentExecutor;
      this.task.name = this.app.currentTaskName;
      this.task.content.dueDate = this.app.planEndDate;
      this.isRefusal = this.app.approved === null ? false : !this.app.approved;
    }
  }

  setTaskDecide() {
    this.dataTaskDecide = this.taskService.matchingData(this.task.content, this.dataTaskDecide);
    if (this.dataTaskDecide.code === 'check_zamakim2' && this.dataTaskDecide.signedDocument) {
      this.dataTaskDecide.signedDocument = false;
      this.updateTask(this.dataTaskDecide);
    }
  }

  private getCurrentUser() {
    this.currentUser = this.authService.getUser();
  }

  private getAssignees() {
    this.taskService.getAssignees(this.task.id, this.dataTaskDecide)
      .pipe(takeUntil(this.destroyed$)).subscribe((res: any) => {
      this.assignees = res && res.body && res.body.length ? res.body : [];
    });
  }

  sendData() {
    if (this.app) {
      this.appSvc.sendApplication(this.app.id)
        .pipe(takeUntil(this.destroyed$)).subscribe(res => {
        if (res.body) {
          this.showDialogBox('Успешно !', true, MessageBoxComponent);
        }
      });
    }
  }

  approved() {
    if (!this.transferTaskToSend) {
      if (!confirm(this.currentLang === 'ru' ? `Передать заявление далее ?'` :
        `Передать заявление далее ?`)) {
        return;
      }
    }
    this.transferTaskToSend = false;
    this.setAgreed(true);

    if (!this.dataTaskDecide.message && !this.checkMessageBySubserviceId()
      && !this.checkMessageByRoles()) {
      return this.snackBar.open('Заполните письмо !', '', {duration: 3000});
    }
    this.send(this.app.taskId, this.dataTaskDecide);

  }

  checkMessageBySubserviceId() {
    const servicesId = [38, 32, 70, 7, 18, 25, 33, 34, 35, 14, 50, 8, 12, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 107, 111, 118, 39, 90,
      120, 125, 122, 121, 105, 114, 116, 117, 113, 110, 119, 115, 112, 130, 131, 132, 135, 137, 138, 139, 140, 136, 58,
      141, 142, 143, 144, 145, 146, 77, 152];

    return servicesId.some(id => id === this.dataTaskDecide.subserviceId);
  }

  checkMessageByRoles() {
    const roles = ['SPECREG_KANC', 'SPECREG_EXECUTOR'];
    return roles.some(role => role === this.dataTaskDecide.role);
  }

  refusal() {
    if (!confirm(this.currentLang === 'ru' ? `Отправить заявление на доработку?'` :
      `Отправить заявление на доработку? ?`)) {
      return;
    }

    this.setAgreed(false);
    this.send(this.app.taskId, this.dataTaskDecide);
  }

  setAgreed(val) {
    if (this.task.content.type === 'SIGN') {
      this.dataTaskDecide.agreed = val;
    }
    this.dataTaskDecide.approved = !this.isRefusal;
  }

  send(taskId: number, data: Decide) {
    data.message = this.closeTagImg(data.message);
    this.dataTaskDecide.from = this.currentUser.firstName + ' ' + this.currentUser.lastName;
    const params = this.assignee ? `assignee=${this.assignee}` : '';
    this.taskService.decide(taskId, data, params)
      .pipe(takeUntil(this.destroyed$)).subscribe(res => {
      this.showDialogBox('Успешно !', true, MessageBoxComponent);
      this.taskService.getSidenavMenuCounts();
    });
  }

  checkAddressRefinementService() {
    if (this.dataTaskDecide.approved) {
      const reqFiles = this.app.appFiles.filter(file => file.fileCategory === 'RESULT_ATTACHMENT');
      if (reqFiles.length > 0 || localStorage.hasResultAttachmentFile) {
        this.dataTaskDecide.message = '.';
        return true;
      }
    } else {
      return true;
    }
  }

  closeTagImg(text) {
    return this.editorSvc.textRenderAndCorrection(text);
  }

  hasServiceType(service: string) {
    if (service === 'TASK' && undefined === this.task.content.type) {
      return true;
    }
    if (service === this.task.content.type || service === this.task.content.type.toUpperCase()) {
      return true;
    } else {
      return false;
    }

  }

  hasService(service: string) {
    return this.taskService.checkHasService(service, this.task.name);
  }

  hasAssignee() {
    if (this.task.assignee) {
      return true;
    } else {
      return false;
    }
  }

  showHistory() {
    this.taskService.getHistory(this.app.id, this.task.content.subserviceId)
      .pipe(takeUntil(this.destroyed$)).subscribe(res => {
      if (res.length > 0) {
        this.showDialogBox(res, false, TaskHistoryComponent);
      } else {
        this.showDialogBox('null', false, MessageBoxComponent);
      }
    });
  }

  showAisgzkComponent() {
    this.showDialogBox(null, false, AisgzkComponent);
  }

  onShowGbdSearch() {
    this.showDialogBox(null, false, SearchGbdComponent);
  }

  showDialogBox(msg: string, isRedirection: boolean, component) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    if (component === SearchGbdComponent) {
      dialogConfig.width = '90vw';
      dialogConfig.height = '70vh';
    }
    dialogConfig.autoFocus = true;
    dialogConfig.data = {title: 'Статус', message: msg};
    this.dialogRef = this.dialog.open(component, dialogConfig);

    if (component === SelectStorageComponent) {
      this.dialogRef.afterClosed()
        .pipe(takeUntil(this.destroyed$)).subscribe((result) => {
        if (result !== undefined && result.isSelectStorage) {
          this.selectStorageObj = result;
          this.getSignXml();
        }
      });
    } else {
      this.dialogRef.afterClosed()
        .pipe(takeUntil(this.destroyed$)).subscribe((result) => {
        this.methodAfterClosed(isRedirection, result);
      });
    }
  }

  public async methodAfterClosed(isRedirection, result) {
    if (isRedirection) {
      this.dialogRef = null;
      this.goBack();
    }
    if (result) {
      if (result.loading) {
        this.dataTaskDecide.internalFiles.push(result.file);
        await this.updateTask(this.dataTaskDecide);
        this.fileComponent.setTaskFiles();
      }
    }
  }

  updateTask(decide: Decide = null) {
    decide = this.taskService.removeUnnecessaryFieldsFromDecide(decide);
    this.taskService.refreshTask(this.task.processInstanceId, decide)
      .pipe(takeUntil(this.destroyed$)).subscribe((res: any) => {
      this.dataTaskDecide = res.body;
      this.taskService.sendTaskDecideSubject(this.dataTaskDecide);
    });
  }

  callParentMethod() {
    this.getApplication.next(this.app.id);
  }

  callParentHandleFileInput(file: any, category: string) {
    file.category = category;
    this.handleFileInput.next(file);
  }

  changeRoute() {
    this.router.navigate(['/']);
  }

  showMyOwnTasks() {
    const name = this.app.bin ? this.app.orgName : `${this.app.firstName} ${this.app.lastName}`;
    const url = `/#/admin/reports?iin=${this.app.iin}&bin=${this.app.bin}&name=${name}`;
    window.open(url, '_blank');
  }

  public goBack() {
    this.location.back();
  }

  hasInternalFileCategory() {
    const availableRoles = ['CN_ARCH_HEAD', 'SPECREG_REGION_HEAD', 'SPECREG_REGION_HEAD2'];
    return availableRoles.some(role => role === this.dataTaskDecide.role);
  }

  getSignXml() {

    if (Object.keys(this.selectStorageObj).length !== 0 && this.selectStorageObj.isSelectStorage) {

      this.signXmlUrl = this.signXmlUrl ? this.signXmlUrl : `userapp/${this.app.id}/sign`;
      if (this.hasInternalFileCategory() && !this.signXmlUrl.includes('internal')) {
        this.signXmlUrl = this.signXmlUrl + '?internal=true';
      }
      this.callbackSign = this.callbackSign ? this.callbackSign : this.methodAfterSign;
      this.updateTask(this.dataTaskDecide);
      let message = this.taskService.extractContent(this.dataTaskDecide.message);
      if (this.isServicesParallel()) {
        this.signXmlUrl = `userapp/${this.app.id}/org/${this.dataTaskDecide.orgCode}/sign`;
        message = this.taskService.extractContent(this.communalText());
      }
      this.api.post2(`userapp/${this.app.id}/xml`, {data: message})
        .pipe(takeUntil(this.destroyed$)).subscribe((data: any) => {
        if (data && data.body.xml && this.app.id != null) {
          this.signService.signXml(this.selectStorageObj.value, 'SIGNATURE', data.body.xml, `${this.app.id}_signXmlBack`); //
        }
      });

    } else {
      this.signXmlUrl = this.signXmlUrl ? this.signXmlUrl : `userapp/${this.app.id}/sign`;
      if (this.hasInternalFileCategory() && !this.signXmlUrl.includes('internal')) {
        this.signXmlUrl = this.signXmlUrl + '?internal=true';
      }
      this.callbackSign = this.callbackSign ? this.callbackSign : this.methodAfterSign;
      this.updateTask(this.dataTaskDecide);
      let message = this.taskService.extractContent(this.dataTaskDecide.message);
      if (this.isServicesParallel()) {
        this.signXmlUrl = `userapp/${this.app.id}/org/${this.dataTaskDecide.orgCode}/sign`;
        message = this.taskService.extractContent(this.communalText());
      }
      this.api.post2(`userapp/${this.app.id}/xml`, {data: message})
        .pipe(takeUntil(this.destroyed$)).subscribe((data: any) => {
        if (data && data.body.xml && this.app.id != null) {
          this.signService.signXml(this.selectedStorage, 'SIGNATURE', data.body.xml, `${this.app.id}_signXmlBack`); //
        }
      });
    }

  }

  signXmlBack(result, callback?: any) {
    if (!this.dataTaskDecide.signedDocument && !this.dataTaskDecide.communalSigned) {
      if (result.code === '200' && result.responseObject && this.signXmlUrl && this.isServicesParallel()) {
        const xml = result.responseObject;
        if (xml && this.dataTaskDecide.orgCode && this.signXmlUrl.indexOf(this.dataTaskDecide.orgCode) > 0) {
          this.dataTaskDecide.signedDocument = true;
          this.api.post2(this.signXmlUrl, {xml}).toPromise().then((data: any) => { callback(data, this); });
          this.dataTaskDecide.signedDocument = false;
        }
      } else if (result.code === '200' && result.responseObject && this.signXmlUrl) {
        const xml = result.responseObject;
        if (xml) {
          this.dataTaskDecide.signedDocument = true;
          this.api.post2(this.signXmlUrl, {xml: xml})
            .pipe(takeUntil(this.destroyed$)).subscribe((data: any) => {
            callback(data, this);
          });
        }
      } else {
        this.dataTaskDecide.signedDocument = false;
      }
    }
  }

  communalText() {
    if (this.dataTaskDecide.orgCode) {
      return this.dataTaskDecide[this.dataTaskDecide.orgCode + 'Text'];
    }
  }

  signAndComplete() {
    this.getSignXml();
    this.transferTaskToSend = true;
  }

  public methodAfterSign(data, dublicateThis) {
    if (!data.body.signed) {
      dublicateThis.snackBar.open(data.body.message, '', {duration: 3000});
      dublicateThis.dataTaskDecide.signedDocument = false;
    } else {
      dublicateThis.dataTaskDecide.signedDocument = true;
      dublicateThis.updateTask(dublicateThis.dataTaskDecide);
      dublicateThis.callParentMethod();
      dublicateThis.snackBar.open('Заявка подписана ! ', '', {duration: 3000});
      if (dublicateThis.transferTaskToSend) {
        dublicateThis.approved();
        dublicateThis.transferTaskToSend = false;
      }
    }
  }

  getRegions() {
    this.dicSvc.getRegions().then((data: Region[]) => {
      this.regions = data;
      const regionWithChildren = (this.regions.find(region => region.children.length > 0));
      this.regions = this.regions.concat(regionWithChildren.children);
    });
  }

  finishedTask() {
    this.dataTaskDecide.finish = true;
    this.approved();
  }

  capitalizeFirstLetter(str) {
    if (str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  }

  changeSignData() {
    this.dataTaskDecide.signedDocument = false;
    this.updateTask(this.dataTaskDecide);
  }

  public getRegionById(regionId) {
    const region = this.dicSvc.getRegionById(this.regions, regionId);
    if (!region) {
      return 'г. Тараз';
    }
    return `(${region.nameRu})`;
  }

  /**
   * Check service is selected storage
   * @returns boolean
   */
  isSelectStorageBtn() {
    return this.selectStorageServices.some(id => id === this.app.subservice.id); //TODO this condition worked only apz and addr_prisv
  }

  /**
   * Call dialog box method
   */
  selectStorageSignXml() {
    this.showDialogBox(null, false, SelectStorageComponent);
  }

  isSubId(subId: any): boolean { return subId.includes(this.dataTaskDecide.subserviceId); }

  isServicesParallel() {
    if (this.isSubId([107])) { return this.dataTaskDecide.order > 6; }
    if (this.isSubId([130, 131, 132, 152])) { return this.dataTaskDecide.order > 5 && this.dataTaskDecide.order < 24; }
  }

  ngOnDestroy(): void {
    this.sign.unsubscribe();
    this.subscription.unsubscribe();
    this.editorSubscription.unsubscribe();
    this.headSubscription.unsubscribe();
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

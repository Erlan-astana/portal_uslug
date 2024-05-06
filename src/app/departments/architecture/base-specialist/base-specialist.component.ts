import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {app} from '../../../shared/models/application.model';
import {ActivatedRoute} from '@angular/router';
import {ProblemService} from '../../../services/problem.service';
import {ApplicationService} from '../../../services/application.service';
import {dic} from '../../../shared/models/dictionary.model';
import Service = dic.Service;

import {auth} from '../../../shared/models/auth.model';
import {AuthService} from '../../../services/auth.service';
import {TranslateService} from '@ngx-translate/core';
import {Subject, Subscription} from 'rxjs';
import {EditorComponent} from '../../../components/editor/editor.component';
import {EditorService} from '../../../services/editor.service';
import {FileService} from '../../../services/file.service';
import {FilesUploadComponent} from '../../../components/files-upload/files-upload.component';
import {takeUntil} from "rxjs/operators";


@Component({
  selector: 'app-specialist-form-letter',
  templateUrl: './base-specialist.component.html',
  styleUrls: ['./base-specialist.component.scss']
})
export class BaseSpecialistComponent implements OnInit, OnDestroy {
  app: app.App = new app.App();
  @ViewChild(EditorComponent, {static: true}) childEditor: EditorComponent;
  public taskId: any;
  task: dic.TaskData = new dic.TaskData();
  currentUser = auth.User = null;
  internalFiles: any = [];
  public sectionId: any;
  currentLang;
  titleVal: string;
  textVal: string;
  toggleEditor: boolean;
  dataTaskDecide: dic.Decide = new dic.Decide();
   appFileCategories: dic.CategoryFiles[] = [
    {
      extensions: 'application/pdf',
      id: 92,
      required: true,
      subserviceId: 21,
      title: 'Документы на выдачу Заявителю',
      titleKk: 'Шағымданушыға берілетін құжаттар',
      titleRu: 'Документы на выдачу Заявителю',
      type: 'RESULT_FILE',
      categoryFiles: [],
      categoryFilesUpload: [],
      display: false
    },
    {
      extensions: 'application/pdf',
      id: 91,
      required: true,
      subserviceId: 21,
      title: 'Приложение к ответу',
      titleKk: 'Жауапқа қосымша',
      titleRu: 'Приложение к ответу',
      type: 'RESULT_ATTACHMENT',
      categoryFiles: [],
      categoryFilesUpload: [],
      display: false
    },
    {
      extensions: 'application/pdf',
      id: 91,
      required: true,
      subserviceId: 21,
      title: 'Приложение к ответу',
      titleKk: 'Жауапқа қосымша',
      titleRu: 'Приложение к ответу',
      type: 'ESKIZ_STAMP',
      categoryFiles: [],
      categoryFilesUpload: [],
      display: false
    },
    {
      extensions: 'application/pdf',
      id: 91,
      required: true,
      subserviceId: 21,
      title: 'Приложение к ответу',
      titleKk: 'Жауапқа қосымша',
      titleRu: 'Приложение к ответу',
      type: 'ZU_PROJECT_STAMP',
      categoryFiles: [],
      categoryFilesUpload: [],
      display: false
    }
  ];
  TECH_CONDITION = {
    extensions: 'application/pdf',
    id: 91,
    required: true,
    subserviceId: 25,
    title: '',
    titleKk: '',
    titleRu: '',
    type: '',
    categoryFiles: [],
    categoryFilesUpload: []
  };
  electCopyResolution: any[] = [
    {
      extensions: 'application/pdf',
      id: 555,
      required: true,
      subserviceId: 21,
      title: 'Электронная копия постановления (решения)',
      type: 'CN_ACT',
      categoryFiles: [],
      categoryFilesUpload: []
    }
  ];
  templates: any = [];
  subscription: Subscription;
  taskDecideSubscription: Subscription;
  editorSubscription: Subscription;
  @ViewChild(FilesUploadComponent, {static: false})
  public fileComponent: FilesUploadComponent;
  destroyed$ = new Subject();

  constructor(
    public route: ActivatedRoute,
    public taskService: ProblemService,
    public appSvc: ApplicationService,
    public authService: AuthService,
    public translate: TranslateService,
    public editorSvc: EditorService,
    public fileSvc: FileService
  ) {
    this.subscription = this.appSvc.getSubjectApp().subscribe(data => {
      this.app = data;
      this.fileComponent.getAppFiles(this.app.id);
    });
    this.taskDecideSubscription = this.taskService.getTaskDecideSubject().subscribe(taskDecide => {
      this.dataTaskDecide = taskDecide;
    });
    this.editorSubscription = this.editorSvc.getComments().subscribe(comment => {
      this.dataTaskDecide.comments = comment;
    });
  }


  ngOnInit() {
    this.initTranslate();
    this.route.queryParams.pipe(takeUntil(this.destroyed$))
      .subscribe(params => {
        this.taskId = params['id'];
        this.sectionId = params['sectionId'];
        this.getCurrentUser();
        this.getTasks();
      });
  }


  private initTranslate() {
    this.translate.onLangChange.pipe(takeUntil(this.destroyed$))
      .subscribe((event: any) => {
        this.currentLang = event.lang;
      });
  }

  public getCurrentUser() {
    this.currentUser = this.authService.getUser();
  }

  public getTasks() {
    if (this.sectionId === '3') {
      this.getTaskWithTaskService();
    } else {
      this.getTaskById();
    }
  }

  getTaskWithTaskService() {
    if (this.currentUser) {
      this.task = this.taskService.getTask();
      this.taskService.sendTaskSubject(this.task);
      this.setTaskData();
      this.getApplication(this.task.content.appId);
    }
  }

  getTaskById() {
    this.taskService.getTaskById(this.taskId).pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        if (res) {
          if (res) {
            this.task = res;
            if (this.task.content) {
              this.setTaskData();
              this.taskService.sendTaskSubject(this.task);
            }
            this.getApplication(this.task.content.appId);
          }
        }
      });
  }

  setTaskData() {
    this.task.name = this.task.name.replace(/ *\([^)]*\) */g, '');
    this.dataTaskDecide = this.taskService.matchingData(this.task.content, this.dataTaskDecide);
  }

  getApplication(appId: number) {
    if (appId) {
      this.appSvc.getApplicationById(appId).pipe(takeUntil(this.destroyed$))
        .subscribe(res => {
          this.appSvc.setApp(res);
          this.app = res;
          //this.app.subservice.service = new Service();
          this.app.taskId = this.taskId;
          if (res.numerationDate) {
            this.app.numerationDate = new Date(this.app.numerationDate);
          }
          this.getTemplates();
        });
    }
  }

  hasService(service: string) {
    if (this.task.name) {
      if (this.task.name.indexOf(service) !== -1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }

  }


  changeSignData() {
    this.dataTaskDecide.signedDocument = false;
    this.taskService.sendTaskDecideSubject(this.dataTaskDecide);
    this.updateTask();
  }

  updateTask(taskDecide = null) {
    this.dataTaskDecide = taskDecide ? taskDecide : this.dataTaskDecide;
    const decide = this.taskService.removeUnnecessaryFieldsFromDecide(this.dataTaskDecide);
    this.taskService.refreshTask(this.task.processInstanceId, decide).pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.dataTaskDecide = response.body;
        this.taskService.sendTaskDecideSubject(this.dataTaskDecide);
      });
  }


  getTemplates(): void {
    this.taskService.getTemplatesBySubServiceId(this.task.content.subserviceId, this.dataTaskDecide.regionId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        this.templates = res;
      });
  }

  setTemplateToMessage(template: any) {
    if (this.sectionId === '9') {
      const text = this.taskService.replaceTemplateTexts(template.text, this.app, this.dataTaskDecide, this.currentUser);
      this.dataTaskDecide.message = text;
      this.dataTaskDecide.approved = template.approved;
      this.editorSvc.sendMessage(text);
    }
  }

  messageChange() {
    if (this.dataTaskDecide.message) {
      this.taskService.sendTaskDecideSubject(this.dataTaskDecide);
    }
  }

  public setText(text, checkText?) {
    if (checkText === 'actFinalText') {
      this.dataTaskDecide.actFinalText = text;
    } else if (checkText === 'ozoMessage') {
      this.dataTaskDecide.ozoMessage = text;
    } else if (checkText === 'actText') {
      this.dataTaskDecide.archMessage = text;
    } else if (checkText && this.taskService.communalFileCategory(checkText)) {
      this.dataTaskDecide[this.dataTaskDecide.orgCode + 'Text'] = text;
    } else if (checkText === 'orderText') {
      this.dataTaskDecide.orderText = text;
    } else {
      this.dataTaskDecide.message = text;
    }
    this.taskService.sendTaskDecideSubject(this.dataTaskDecide);
  }

  previewPdf(recommendation = null, checkText?) {
    let body: any = {}; let text;
    if (checkText === 'actFinalText') {
      text = this.closeTagImg(this.dataTaskDecide.actFinalText);
    } else if (checkText === 'ozoMessage') {
      text = this.closeTagImg(this.dataTaskDecide.ozoMessage);
    } else if (checkText === 'actText') {
      text = this.closeTagImg(this.dataTaskDecide.archMessage);
    } else if (checkText && this.taskService.communalFileCategory(checkText)) {
      text = this.closeTagImg(this.dataTaskDecide[this.dataTaskDecide.orgCode + 'Text']);
    } else if (checkText === 'orderText') {
      text = this.closeTagImg(this.dataTaskDecide.orderText);
    } else if (this.dataTaskDecide.message) {
      text = this.closeTagImg(recommendation || this.dataTaskDecide.message);
    }
    body.message = text;
    this.fileSvc.generatePdfFromContent(body);
  }

  closeTagImg(text) {
    return this.editorSvc.textRenderAndCorrection(text);
  }

  public onReady(editor) {
    this.taskService.onReady(editor);
  }

  addFileCategory(value) {
    if (value === 'CN_ACT') {
      this.TECH_CONDITION.titleKk = 'Жер комиссиясының қорытындысы';
      this.TECH_CONDITION.titleRu = 'Заключение земельной комисии';
      this.TECH_CONDITION.type = 'CN_ACT';
    } else {
      this.TECH_CONDITION.type = value;
    }
    const obj = JSON.parse(JSON.stringify(this.TECH_CONDITION));
    this.appFileCategories.push(obj);
  }

  isSubId(subId: any): boolean {
    if (Array.isArray(subId)) { return subId.includes(this.dataTaskDecide.subserviceId); }
  }

  ngOnDestroy(): void {
    this.taskDecideSubscription.unsubscribe();
    this.subscription.unsubscribe();
    this.editorSubscription.unsubscribe();
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {auth} from '../../../shared/models/auth.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {ProblemService} from '../../../services/problem.service';
import {MatSnackBar} from '@angular/material';
import {AdminService} from '../../../services/admin.service';
import {dic} from '../../../shared/models/dictionary.model';
import {FileService} from '../../../services/file.service';
import {AuthService} from '../../../services/auth.service';
import {TranslateService} from '@ngx-translate/core';
import Correspondence = dic.Correspondence;
import {DirectoryService} from '../../../services/directory.service';
import {EditorService} from '../../../services/editor.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
/*
import DocumentEditor from '@ckeditor/ckeditor5-build-decoupled-document';
*/

@Component({
  selector: 'app-correspondence-form',
  templateUrl: './correspondence-form.component.html',
  styleUrls: ['./correspondence-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CorrespondenceFormComponent implements OnInit {
  executors: auth.User[] = [];
  correspondenceForm: FormGroup;
  categoryId: number;
  categories: any;
  correspondenceFiles: any[] = [];
  type: string;
  correspondenceId: string = null;
  correspondence: Correspondence = new Correspondence();
  currentLang;
  fileCategories: dic.CategoryFiles[] = [
    {
      extensions: 'application/pdf',
      id: null,
      required: true,
      subserviceId: null,
      title: 'Внутренние файлы',
      titleRu: 'Внутренние файлы',
      titleKk: 'Ішкі файлдар',
      type: 'CORRESPONDENCE',
      categoryFiles: [],
      categoryFilesUpload: [],
      display: false
    }
  ];
  destroyed$ = new Subject();
  /*public Editor = DocumentEditor;*/
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private taskService: ProblemService,
    private authSvc: AuthService,
    private snackBar: MatSnackBar,
    private adminService: AdminService,
    private fileSvc: FileService,
    private translate: TranslateService,
    private directorySvc: DirectoryService,
    private editorSvc: EditorService
  ) {
    this.currentLang = this.translate.currentLang ? this.translate.currentLang : this.translate.getDefaultLang();
  }

  ngOnInit() {
    this.getQueryParams();
    this.getCategories();
    this.initForm();
    this.getExecutors();
    this.getCorresPondence();
    this.initTranslate();
  }

  initTranslate() {
    this.translate.onLangChange
    .pipe(takeUntil(this.destroyed$))
    .subscribe((event: any) => {
      this.currentLang = event.lang;
    });
  }

  getQueryParams() {
    this.route.queryParams
    .pipe(takeUntil(this.destroyed$))
    .subscribe(params => {
      this.categoryId = parseInt(params['categoryId']);
      this.type = params['type'];
      this.correspondenceId = params['correspondenceId'];
    });
  }

  getCorresPondence() {
    if (this.correspondenceId) {
      this.directorySvc.getCorrespondence(this.correspondenceId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        this.correspondence = res;
        this.setCorrespondence(res);
        //this.editorSvc.sendMessage(this.correspondence.body);
      });
    }
  }

  setCorrespondence(correspondence: Correspondence) {
    this.adminService.setForm(this.formControls, correspondence);
  }

  get formControls() {
    return this.correspondenceForm.controls;
  }

  private initForm() {
    this.correspondenceForm = this.fb.group({
      id: [''],
      regNumber: [''],
      type: [this.type],
      executeDueDate: [''],
      sender: [''],
      executable: [''],
      executor: this.fb.group({
        id: ['']
      }),
      regDate: [''],
      executed: [''],
      body: [''],
      receiver: [''],
      outNumber: [''],
      outDate: [''],
      outBody: [''],
      category: this.fb.group({
        id: [this.categoryId, [Validators.required]]
      }),
    });
  }

  onChangesExecutable(): void {
    this.correspondence.executable = !this.correspondence.executable;
    if (this.correspondence.executable) {
      this.correspondenceForm.get('executeDueDate').setValidators([Validators.required]);
      this.correspondenceForm.get('executor').get('id').setValidators([Validators.required]);
      this.correspondenceForm.get('executeDueDate').updateValueAndValidity();
      this.correspondenceForm.get('executor').get('id').updateValueAndValidity();
    } else {
      this.correspondenceForm.get('executeDueDate').setValue(null);
      this.correspondenceForm.get('executor').get('id').setValue(null);
      this.correspondenceForm.get('executeDueDate').clearValidators();
      this.correspondenceForm.get('executor').get('id').clearValidators();
      this.correspondenceForm.get('executeDueDate').updateValueAndValidity();
      this.correspondenceForm.get('executor').get('id').updateValueAndValidity();
    }
  }

  getCategories() {
    this.directorySvc.getCorrespondencesCategories()
    .pipe(takeUntil(this.destroyed$))
    .subscribe(res => {
      this.categories = res;
    });
  }

  private getExecutors() {
    this.authSvc.getUsersByRole(2, 77)
    .pipe(takeUntil(this.destroyed$))
    .subscribe(res => {
      if (res.length > 0) {
        this.executors = res;
      }
    });
  }

  save() {
    if (this.correspondenceForm.invalid) {
      return false;
    }
    if (!this.correspondenceId) {
      this.addCorrespondence();
    } else {
      this.updateCorrespondence();
    }
  }

  addCorrespondence() {
    this.directorySvc.addCorrespondence(this.correspondenceForm.value)
    .pipe(takeUntil(this.destroyed$))
    .subscribe((res: any) => {
      if (res) {
        this.taskService.getSidenavMenuCounts();
        this.adminService.openSkackbar('Канцелярия добавлен успешнo, теперь вы сможете добавить файлы');
        this.correspondenceId = res.body.id;
      }
    });
  }

  updateCorrespondence() {
    this.directorySvc.updateCorrespondence(this.correspondenceForm.value)
    .pipe(takeUntil(this.destroyed$))
    .subscribe(res => {
      if (res) {
        this.snackBar.open('Канцелярия изменон успешно!', '', {duration: 3000});
        this.adminService.goBack();
      }
    });
  }

  public onReady(editor) {
    this.taskService.onReady(editor);
  }

  public setText(text) {
    this.correspondenceForm.controls.outBody.setValue(text);
  }

  goBack() {
    this.adminService.goBack();
  }
}

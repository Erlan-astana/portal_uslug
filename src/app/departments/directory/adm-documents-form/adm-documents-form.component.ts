import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {auth} from '../../../shared/models/auth.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {ProblemService} from '../../../services/problem.service';
import {AuthService} from '../../../services/auth.service';
import {MatSnackBar} from '@angular/material';
import {AdminService} from '../../../services/admin.service';
import {FileService} from '../../../services/file.service';
import {TranslateService} from '@ngx-translate/core';
import {DirectoryService} from '../../../services/directory.service';
import {dic} from '../../../shared/models/dictionary.model';
import AdmDocument = dic.AdmDocument;
import {EditorService} from '../../../services/editor.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/*import DocumentEditor from '@ckeditor/ckeditor5-build-decoupled-document';*/

@Component({
  selector: 'app-adm-documents-form',
  templateUrl: './adm-documents-form.component.html',
  styleUrls: ['./adm-documents-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdmDocumentsFormComponent implements OnInit {
  executors: auth.User[] = [];
  documentForm: FormGroup;
  categoryId: number;
  /*public Editor = DocumentEditor;*/
  categories: any;
  documentId: string = null;
  document: AdmDocument = new AdmDocument();
  currentLang;
  fileCategories: dic.CategoryFiles[] = [
    {
      extensions: 'application/pdf',
      id: null,
      required: true,
      subserviceId: null,
      title: 'Внутренние файлы ',
      titleRu: 'Внутренние файлы',
      titleKk: 'Ішкі файлдар',
      type: 'ADM_DOCUMENT',
      categoryFiles: [],
      categoryFilesUpload: [],
      display: false
    }
  ];

  destroyed$ = new Subject();

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
    this.getDocument();
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
      this.documentId = params['documentId'];
    });
  }

  getDocument() {
    if (this.documentId) {
      this.directorySvc.getDocument(this.documentId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        this.document = res;
        this.editorSvc.sendMessage(this.document.body);
        this.setDocument(res);
      });
    }
  }

  setDocument(document: AdmDocument) {
    this.adminService.setForm(this.formControls, document);
  }

  get formControls() {
    return this.documentForm.controls;
  }

  private initForm() {
    this.documentForm = this.fb.group({
      id: [''],
      author: [null],
      nameRu: [''],
      nameKk: [''],
      nameEn: [''],
      employee: this.fb.group({
        id: ['']
      }),
      body: [''],
      date: [''],
      category: this.fb.group({
        id: [this.categoryId, [Validators.required]]
      }),
    });
  }

  getCategories() {
    this.directorySvc.getAdmDocumentCategories()
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
    if (this.documentForm.invalid) {
      return false;
    }
    if (!this.documentId) {
      this.addCorrespondence();
    } else {
      this.updateCorrespondence();
    }
  }

  addCorrespondence() {
    this.directorySvc.addDocument(this.documentForm.value)
    .pipe(takeUntil(this.destroyed$))
    .subscribe((res: any) => {
      if (res) {
        this.taskService.getSidenavMenuCounts();
        this.adminService.openSkackbar('Документ добавлен успешнo, теперь вы сможете добавить файлы');
        this.documentId = res.body.id;
      }
    });
  }

  updateCorrespondence() {
    this.directorySvc.updateDocument(this.documentForm.value)
    .pipe(takeUntil(this.destroyed$))
    .subscribe(res => {
      if (res) {
        this.snackBar.open('Документ изменон успешно!', '', {duration: 3000});
        this.adminService.goBack();
      }
    });
  }

  public setText(text) {
    this.documentForm.controls.body.setValue(text);
  }

  goBack() {
    this.adminService.goBack();
  }
}

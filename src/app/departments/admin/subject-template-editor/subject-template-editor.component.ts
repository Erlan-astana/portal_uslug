import {Component, OnInit} from '@angular/core';
import {DirectoryService} from '../../../services/directory.service';
import {dic} from '../../../shared/models/dictionary.model';
/*import DocumentEditor from '@ckeditor/ckeditor5-build-decoupled-document';*/
import {ProblemService} from '../../../services/problem.service';
import {MatSnackBar} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {EditorService} from '../../../services/editor.service';
import {FileService} from '../../../services/file.service';
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-subject-template-editor',
  templateUrl: './subject-template-editor.component.html',
  styleUrls: ['./subject-template-editor.component.scss']
})
export class SubjectTemplateEditorComponent implements OnInit {
  selectedSubjectId: number = null;
  subjectTemplates: any;
  subjects: dic.Subject[] = [];
  hasTemplate: boolean = false;
  templateData: dic.SubjectTemplateEditor = new dic.SubjectTemplateEditor();
  /*public Editor = DocumentEditor;*/
  currentLang;
  destroyed$ = new Subject();
  constructor(
    private directorySvc: DirectoryService,
    private taskSvc: ProblemService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private editorSvc: EditorService,
    private fileSvc: FileService,
  ) {
    this.currentLang = this.translate.currentLang ? this.translate.currentLang : this.translate.getDefaultLang();
  }

  ngOnInit() {
    this.getSubjects();
    this.initTranslate();
  }

  initTranslate() {
    this.translate.onLangChange.pipe(takeUntil(this.destroyed$))
      .subscribe((event: any) => {
      this.currentLang = event.lang;
    });
  }

  private getSubjects() {
    this.directorySvc.getContractSubjects().pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
      if (res.content.length > 0) {
        this.subjects = res.content;
      }
    });
  }

  getTemplates(selectedSubjectId): void {
    this.directorySvc.getSubjectTemplates(selectedSubjectId).pipe(takeUntil(this.destroyed$))
      .subscribe((data: any) => {
      this.subjectTemplates = data.content;
      this.selectedSubjectId = selectedSubjectId;
    });
  }

  saveTemplate() {
    if (this.selectedSubjectId) {
      this.templateData.contractSubject.id = this.selectedSubjectId;
      if (this.templateData.id) {
        this.updateTemplate();
      } else {
        this.createTemplate();
      }
    } else {
      this.snackBar.open('Выберите предмет договора', '', {duration: 3000});
    }

  }

  createTemplate() {
    this.directorySvc.addSubjectTemplates(this.templateData).pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
      this.snackBar.open('Шаблон успешно создан', '', {duration: 3000});
      this.getTemplates(this.selectedSubjectId);
      this.hasTemplate = false;
      this.cancel();
    });
  }

  updateTemplate() {
    this.directorySvc.updateSubjectTemplates(this.templateData).pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
      if (res) {
        this.snackBar.open('Шаблон успешно обновлен', '', {duration: 3000});
        this.getTemplates(this.selectedSubjectId);
        this.hasTemplate = false;
        this.cancel();
      }
    });
  }

  removeTemplate(template) {
    if (confirm(this.currentLang === 'ru' ? `Удалить шаблон '${template.nameRu}?'` : `Сіз осы шаблонды өшіргіңіз келе ме? '${template.nameKk}'`)) {
      this.directorySvc.removeSubjectTemplate(template.id).pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        if (res) {
          this.snackBar.open('Шаблон успешно удален', '', {duration: 3000});
          this.getTemplates(this.selectedSubjectId);
          this.cancel();
        }
      });
    }
  }

  previewPdf() {
    if (this.templateData.text) {
      let text = this.closeTagImg(this.templateData.text);
      let body: any = {};
      body.message = text;
      this.fileSvc.generatePdfFromContent(body);
    }
  }

  closeTagImg(text) {
    return this.editorSvc.textRenderAndCorrection(text);
  }

  setTemplate(template) {
    this.templateData = template;
    this.editorSvc.sendMessage(template.text);
    this.hasTemplate = true;
  }

  addNewTemplate() {
    this.hasTemplate = true;
  }

  cancel() {
    this.templateData = new dic.SubjectTemplateEditor();
    this.hasTemplate = false;
  }

  public onReady(editor) {
    this.taskSvc.onReady(editor);
  }

  public setText(text) {
    this.templateData.text = text;
  }
}

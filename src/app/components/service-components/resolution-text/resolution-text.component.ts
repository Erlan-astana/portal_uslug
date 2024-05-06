import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {dic} from '../../../shared/models/dictionary.model';
import Decide = dic.Decide;
import {app} from '../../../shared/models/application.model';
import App = app.App;
import {EditorService} from '../../../services/editor.service';
import {FileService} from '../../../services/file.service';
import {ProblemService} from '../../../services/problem.service';


@Component({
  selector: 'app-resolution-text',
  templateUrl: './resolution-text.component.html',
  styleUrls: ['./resolution-text.component.scss']
})
export class ResolutionTextComponent implements OnInit {
  @Output() updateTask = new EventEmitter<any>();
  @Input() taskDecide: Decide = new Decide();
  @Input() app: App;
  @Input() currentUser: any;
  @Input() sectionId: any = null;
  @Input() templates: any;

  constructor(
    private editorSvc: EditorService,
    private fileSvc: FileService,
    private taskService: ProblemService
  ) {

  }

  ngOnInit() {
  }

  closeTagImg(text) {
    return this.editorSvc.textRenderAndCorrection(text);
  }

  previewPdf() {
    if (this.taskDecide.orderText) {
      const text = this.closeTagImg(this.taskDecide.orderText);
      const body: any = {};
      body.message = text;
      this.fileSvc.generatePdfFromContent(body);
    }
  }

  showResolutionEditorTemplatesByUserRole(taskRole) {
    if (this.taskDecide.role) {
      const availableRoles = ['CN_OZO_EXECUTOR', 'UZP_POST_EXECUTOR', 'CNREG_POST'];
      return availableRoles.some(role => role === taskRole);
    }
  }

  setTemplateToMessage(template) {
    if (this.sectionId === '9') {
      const text = this.taskService.replaceTemplateTexts(template.text, this.app);
      this.editorSvc.sendMessage(text);
    }
  }

  public setText(text) {
    this.taskDecide.orderText = text;
    this.taskService.sendTaskDecideSubject(this.taskDecide);
  }

  showTemplatesByUserRoles() {
    return true;
  }

  saveEditor() {
    this.updateTask.next();
  }

}

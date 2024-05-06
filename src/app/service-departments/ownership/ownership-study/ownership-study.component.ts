import {Component, OnInit, ViewChild} from '@angular/core';
import {BaseSpecialistComponent} from '../../../departments/architecture/base-specialist/base-specialist.component';
import {ActivatedRoute} from '@angular/router';
import {ProblemService} from '../../../services/problem.service';
import {ApplicationService} from '../../../services/application.service';
import {AuthService} from '../../../services/auth.service';
import {TranslateService} from '@ngx-translate/core';
import {EditorService} from '../../../services/editor.service';
import {FileService} from '../../../services/file.service';
import {EditorComponent} from '../../../components/editor/editor.component';

@Component({
  selector: 'app-ownership-study',
  templateUrl: './ownership-study.component.html',
  styleUrls: ['./ownership-study.component.scss']
})
export class OwnershipStudyComponent extends BaseSpecialistComponent implements OnInit {
  ozoEditorAccessRoles = ['SALE_EXECUTOR1', 'SALE_HEAD1', 'DEMOLITION_EXECUTOR', 'DEMOLITION_HEAD1', 'SALE_REG_EXECUTOR1',
    'PPR_EXECUTOR', 'RS_EXECUTOR', 'RS_EXECUTOR1', 'RS_EXECUTOR2', 'PPR_EXECUTOR_1A', 'PPR_EXECUTOR1'];

  ozo2EditorAccessRoles = ['SALE_EXECUTOR2', 'SALE_HEAD2', 'RS_HEAD2', 'PPR_HEAD2', 'RS_EXECUTOR1', 'PPR_EXECUTOR1'];
  @ViewChild('recommendationEditor', {static: false})
  public recommendationEditor: EditorComponent;
  toggleRecommendationEditor: boolean;

  constructor(
    public route: ActivatedRoute,
    public taskService: ProblemService,
    public appSvc: ApplicationService,
    public authService: AuthService,
    public translate: TranslateService,
    public editorSvc: EditorService,
    public fileSvc: FileService
  ) {
    super(route, taskService, appSvc, authService, translate, editorSvc, fileSvc);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  public checkAvailableRolesForOzo2Editor(taskRole) {
    return this.taskService.checkRoles(taskRole, this.ozo2EditorAccessRoles);
  }

  public setRecomendation(text) {
    this.dataTaskDecide.recomendation = text;
    this.taskService.sendTaskDecideSubject(this.dataTaskDecide);
  }

  public checkAvailableRolesForEditor(taskRole) {
    if (taskRole) {
      const rsEditorAccessRoles = ['RS_HEAD1', 'PPR_HEAD1', 'RS_RUK_RELIGION', 'RS_HEAD2',
        'SALE_REG_HEAD1', 'PPR_HEAD2', 'PPR_RUK_RELIGION', 'DEMOLITION_AKIM'];
      const roles = [...rsEditorAccessRoles, ...this.ozoEditorAccessRoles];
      return this.taskService.checkRoles(taskRole, roles);
    }
  }

  public checkAvailableRolesForEditorTemplates(taskRole) {
    if (taskRole) {
      const rsEditorAccessRoles = [];
      const roles = [...rsEditorAccessRoles, ...this.ozoEditorAccessRoles, ...this.ozo2EditorAccessRoles];

      return this.taskService.checkRoles(taskRole, roles);
    }
  }

  setTemplateToRecomendation(template: any) {
    if (this.sectionId === '9') {
      const text = this.taskService.replaceTemplateTexts(template.text, this.app);
      this.dataTaskDecide.message = text;
      this.dataTaskDecide.approved = template.approved;
      //this.editorSvc.sendMessage(text);
      this.recommendationEditor.editor.setData(text);
    }
  }

}

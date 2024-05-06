import {AfterViewChecked, Component, OnInit, ViewChild} from '@angular/core';
import {BaseSpecialistComponent} from '../../../departments/architecture/base-specialist/base-specialist.component';
import {ActivatedRoute} from '@angular/router';
import {ProblemService} from '../../../services/problem.service';
import {ApplicationService} from '../../../services/application.service';
import {AuthService} from '../../../services/auth.service';
import {TranslateService} from '@ngx-translate/core';
import {EditorService} from '../../../services/editor.service';
import {FileService} from '../../../services/file.service';
import {ShortServiceHeaderComponent} from '../short-service-header/short-service-header.component';

@Component({
  selector: 'app-short-service-study',
  templateUrl: './short-service-study.component.html',
  styleUrls: ['./short-service-study.component.scss']
})
export class ShortServiceStudyComponent extends BaseSpecialistComponent implements OnInit, AfterViewChecked {
  @ViewChild(ShortServiceHeaderComponent, {static: false})
  public headerComponent: ShortServiceHeaderComponent;
  headerComponentLoaded: boolean;

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

  setTemplate(template) {
    this.headerComponent.isRefusal = !template.approved;
    this.setTemplateToMessage(template);
  }

  ngAfterViewChecked() {
    if (this.headerComponent && !this.headerComponentLoaded) {
      this.headerComponentLoaded = true;
    }
  }

  showEditorTemplatesByRole(taskRole) {
    if (taskRole) {
      const unavailableRoles = ['ADRPRISV_HEAD', 'ADRUPRAZ_HEAD', 'ADRUTOCH_HEAD'];
      return unavailableRoles.some(role => role !== taskRole);
    }
  }

  checkRoles() {
    /* if (this.dataTaskDecide.role === 'SPECREG_HEAD' ||
       this.dataTaskDecide.role === 'PRELIMDESIGN_HEAD') {
       this.headerComponent.isHead = true;
       this.cdRef.detectChanges();
     }*/
  }


  showEditorByServiceIdAndRole() {
    const availableServicesId = [18, 19, 17, 58, 57, 59, 134];
    if (availableServicesId.some(role => role === this.app.subservice.id)) {
      return true;
    }
    const availableRoles = ['DELIMOST_EXECUTOR', 'DELIMOST_HEAD2', 'DELIMOST_HEAD'];
    return availableRoles.some(role => role === this.dataTaskDecide.role);
  }

  hasRegisterDecree() {
    const availableRoles = ['ADRPRISV_EXECUTOR', 'REKULTIVACIA_KANC', 'DELIMOST_CANC'];
    return availableRoles.some(role => role === this.dataTaskDecide.role);
  }
}

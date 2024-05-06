import {AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {BaseSpecialistComponent} from '../../../departments/architecture/base-specialist/base-specialist.component';
import {ActivatedRoute} from '@angular/router';
import {ProblemService} from '../../../services/problem.service';
import {ApplicationService} from '../../../services/application.service';
import {AuthService} from '../../../services/auth.service';
import {TranslateService} from '@ngx-translate/core';
import {EditorService} from '../../../services/editor.service';
import {FileService} from '../../../services/file.service';
import {HeaderArchSpecialistComponent} from '../../../components/header-arch-specialist/header-arch-specialist.component';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import construct = Reflect.construct;

@Component({
  selector: 'app-sketch-study',
  templateUrl: './sketch-study.component.html',
  styleUrls: ['./sketch-study.component.scss']
})
export class SketchStudyComponent extends BaseSpecialistComponent implements OnInit, AfterViewChecked {
  @ViewChild(HeaderArchSpecialistComponent, {static: false})
  public headerComponent: HeaderArchSpecialistComponent;
  headerComponentLoaded: boolean;
  destroyed$ = new Subject();

  constructor(
    public route: ActivatedRoute,
    public taskService: ProblemService,
    public appSvc: ApplicationService,
    public authService: AuthService,
    public translate: TranslateService,
    public editorSvc: EditorService,
    public fileSvc: FileService,
    private cdRef: ChangeDetectorRef
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

  getApplicationAndSaveFiles(appId: number) {
    this.getApplication(appId);
    if (this.app.subservice.id === 23) {
      this.saveUzpFile(appId);
      this.getUzpFile(appId);
    }
  }

  public saveUzpFile(id) {
    this.taskService.saveUzpFile(id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        console.log(res);
      });
  }

  public getUzpFile(appId) {
    this.taskService.getUzpFile(appId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res: any) => {
        const file = new File([res], `app-sheet-${new Date().getTime()}.pdf`,
          {lastModified: new Date().getTime(), type: res.type});
        this.setToTaskUzpFile(file, res);
      });
  }

  showEditor() {
    if (this.app.subservice.id === 39 && this.dataTaskDecide.order > 1 || this.app.subservice.id === 37 && this.dataTaskDecide.order > 1) {
      return true;
    }
    if (this.app.subservice.id === 21 || this.app.subservice.id === 23 || this.app.subservice.id === 61 ||
      this.app.subservice.id === 63) {
      return true;
    }
  }

  showTemplateByRole() {
    const availableRoles = ['PRELIMDESIGN_REG_EXECUTOR', 'UZP_EXECUTOR', 'SPECREG_DECISION', 'UZP_REG_EXECUTOR', 'PRELIMDESIGN_EXECUTOR',
      'SPECREG_REGION_DECISION', 'SPECREG_REGION_HEAD', 'SPECREG_REGION_EXECUTION2', 'SPECREG_REGION_HEAD2', 'SPECREG_REGION_EXECUTION3', 'SPECREG_REGION_HEAD3'];
    return availableRoles.some(role => role === this.dataTaskDecide.role);
  }

  public setToTaskUzpFile(file, res) {
    this.fileSvc.getAddFileSingleReq(file)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: any) => {
        const uploadFile = {
          uid: response.uid,
          fileName: response.fileName,
          fileCategory: 'internal',
          size: res.fileSize
        };
        this.dataTaskDecide.internalFiles.push(uploadFile);
        this.updateTask({decide: this.dataTaskDecide});
      });
  }

  ngAfterViewChecked() {
    if (this.headerComponent && !this.headerComponentLoaded) {
      this.checkRoles();
      this.headerComponentLoaded = true;
    }
  }

  checkRoles() {
    const role = this.dataTaskDecide.role;
    const headRoles = ['SPECREG_REGION_HEAD', 'SPECREG_HEAD', 'PRELIMDESIGN_HEAD', 'PRELIMDESIGN_REG_HEAD',
      'UZP_REG_HEAD', 'SPECREG_REGION_HEAD2', 'SPECREG_REGION_HEAD3'];
    if (headRoles.some(headRole => headRole === role)) {
      this.headerComponent.isHead = true;
      this.cdRef.detectChanges();
    }

    if (this.dataTaskDecide.role === 'SPECREG_REGION_EXECUTION2' || this.dataTaskDecide.role === 'SPECREG_REGION_EXECUTION3') {
      this.dataTaskDecide.message = '.';
      this.editorSvc.sendMessage('.');
      this.cdRef.detectChanges();
    }
  }

  public setOrderNumber(orderNumber) {
    const text = this.dataTaskDecide.message.replace(/orderNumber/gi, `#${orderNumber}`);
    this.editorSvc.sendMessage(text);
  }

  public rolesHasSpecregForm() {
    const availableRoles = ['SPECREG_REGION_EXECUTION3', 'SPECREG_DECISION'];
    return availableRoles.some(role => this.dataTaskDecide.role === role);
  }


}

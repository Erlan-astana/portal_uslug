import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProblemService } from '../../../services/problem.service';
import { ApplicationService } from '../../../services/application.service';
import { AuthService } from '../../../services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { EditorService } from '../../../services/editor.service';
import { FileService } from '../../../services/file.service';
import { BaseSpecialistComponent } from '../../../departments/architecture/base-specialist/base-specialist.component';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ListParallelComponent } from 'src/app/components/service-components/list-parallel/list-parallel.component';

@Component({
  selector: 'app-zu-pl-study',
  templateUrl: './zu-pl-study.component.html',
  styleUrls: ['./zu-pl-study.component.scss']
})
export class ZuPlStudyComponent extends BaseSpecialistComponent implements OnInit, AfterViewChecked {

  listComFileCategory = ['TECH_CONDITION_GAS', 'TECH_CONDITION_ZHES', 'TECH_CONDITION_KAZAHTELECOM', 'TECH_CONDITION_TRANSTELECOM',
  'TECH_CONDITION_ZHAMBYL_SU', 'TECH_CONDITION_ZHAMBYL_ZHYLU'];
  checkFileType;

  constructor(
    public route: ActivatedRoute,
    public taskService: ProblemService,
    public appSvc: ApplicationService,
    public api: ApiService,
    public authService: AuthService,
    public translate: TranslateService,
    public editorSvc: EditorService,
    public fileSvc: FileService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    super(route, taskService, appSvc, authService, translate, editorSvc, fileSvc);
  }

  ngOnInit() { super.ngOnInit(); }

  setTemplate(template) { this.setTemplateToMessage(template); }

  isRegKanc() { return this.dataTaskDecide.code === 'KANC_REG'; }

  isTemplates() { return this.dataTaskDecide.code === 'TEMPLATE'; }

  isEditor() {
    this.giveTitleValue();
    return !['', null, 1, 2, 3].some(i => i == this.dataTaskDecide.order);
  }

  ngAfterViewChecked() {
    const checkPreliminaryAct = this.appFileCategories.some(f => f.type === 'ACT_REJECT' || f.type === 'ACT_APPROVE');
    if (!checkPreliminaryAct && this.dataTaskDecide.order > 5) { this.addFileCategory('ACT_APPROVE'); }
    const app = this.appSvc.getApp();
    if (!this.checkFileType && this.dataTaskDecide.order > 5 && app.files && app.files.length > 0) {
      const comFiles = app.files.filter((f) => this.listComFileCategory.includes(f.fileCategory));
      if (comFiles.length > 0) {
        comFiles.forEach(v => { this.addFileCategory(v.fileCategory); });
        this.checkFileType = true;
      }
    }
    const checkActFinal = this.appFileCategories.some(file => file.type === 'ACT_FINAL');
    if (!checkActFinal && this.dataTaskDecide.order > 23) { this.addFileCategory('ACT_FINAL'); }
  }

  genRegNumberAndDate() {
    this.appSvc.genRegNumberFileCategory(this.app.id,
      { numeration: this.dataTaskDecide.number, numerationDate: this.dataTaskDecide.date },
      this.communalFileCategory(this.dataTaskDecide.orgCode)).toPromise()
      .then(res => { this.fileComponent.getAppFiles(this.app.id); });
  }

  giveTitleValue() {
    if ([24, 25].includes(+this.dataTaskDecide.order)) {
      this.titleVal = 'actFinalText'; this.textVal = this.dataTaskDecide.actFinalText;
    } else if (this.dataTaskDecide.order < 6) {
      this.textVal = this.dataTaskDecide.message;
    } else if (this.dataTaskDecide.orgCode) {
      this.titleVal = this.dataTaskDecide.orgCode; this.textVal = this.dataTaskDecide[this.dataTaskDecide.orgCode + 'Text'];
    }
  }

  openListParallel() {
    const dialogRef = this.dialog.open(ListParallelComponent, { width: '900px',  height: '600px',
    data: { dataTaskDecide: this.dataTaskDecide } });
    dialogRef.afterClosed().toPromise().then((result: any) => {
      if (result) {
        this.snackBar.open('Пользователи выбраны!', '', { duration: 3000 });
      }
    });
  }

  communalFileCategory(orgCode) { return this.taskService.communalFileCategory(orgCode); }

  updateCoordinates() {
    this.api.get2(`/userapp/geom/${this.app.id}`).toPromise().then((result: any) => {
      if (result) {
        this.snackBar.open('координаты обновлены !', '', { duration: 3000 });
      }
    });
  }

}

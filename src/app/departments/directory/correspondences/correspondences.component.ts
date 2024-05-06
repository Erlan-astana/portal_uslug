import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {dic} from '../../../shared/models/dictionary.model';
import Problem = dic.Problem;
import {ProblemService} from '../../../services/problem.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {DirectoryService} from '../../../services/directory.service';
import {FileService} from '../../../services/file.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-correspondences',
  templateUrl: './correspondences.component.html',
  styleUrls: ['./correspondences.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CorrespondencesComponent implements OnInit {
  dataSource: any;
  displayedColumns: string[] = ['position', 'id', 'regDate', 'type', 'sender', 'action'];
  currentPage = 1;
  pageSize = 10;
  totalElements: number = null;
  currentLang;
  name: string = '';
  sectionId: string;
  sectionName: string;
  categories: any;
  type: string;
  destroyed$ = new Subject();

  constructor(
    private taskService: ProblemService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private directorySvc: DirectoryService,
    private fileService: FileService
  ) {
    {
      this.currentLang = this.translate.currentLang ? this.translate.currentLang : this.translate.getDefaultLang();
    }
  }

  ngOnInit() {
    this.initTranslate();
    this.getQueryParams();
    this.getCategories();
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
      this.sectionId = params['id'];
      this.sectionName = params['name'];
      this.getCorrespondences();
    });
  }

  getCount() {
    return (this.currentPage - 1) * 10;
  }

  getCorrespondences() {
    if (this.sectionId === '16') {
      this.getInCorrespondences();
      this.type = 'IN';
    }
    if (this.sectionId === '17') {
      this.getOutCorrespondences();
      this.type = 'OUT';
    }


  }

  getInCorrespondences() {
    this.directorySvc.getInCorrespondences(this.currentPage - 1, this.pageSize)
    .pipe(takeUntil(this.destroyed$))
    .subscribe(res => {
      this.dataSource = res.content;
      this.totalElements = res.totalElements;
    });
  }

  getOutCorrespondences() {
    this.directorySvc.getOutCorrespondences(this.currentPage - 1, this.pageSize)
    .pipe(takeUntil(this.destroyed$))
    .subscribe(res => {
      this.dataSource = res.content;
      this.totalElements = res.totalElements;
    });
  }

  getCategories() {
    this.directorySvc.getCorrespondencesCategories()
    .pipe(takeUntil(this.destroyed$))
    .subscribe(res => {
      this.categories = res;
    });
  }

  create(category: any) {
    const params: any = {categoryId: category.id, type: this.type};
    this.changeRoute(`directory/correspondences/create`, params);
  }

  edit(id: number) {
    const params: any = {correspondenceId: id};
    this.changeRoute('directory/correspondences/edit', params);
  }

  delete(correspondence: any) {
    if (confirm(this.currentLang === 'ru' ? `Удалить канцелярию '${correspondence.id}?'` : `Сіз осы канцелярияны өшіргіңіз келе ме? '${correspondence.id}'`)) {
      this.directorySvc.removeCorrespondence(correspondence.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        if (res) {
          this.snackBar.open('Канцелярия успешно удален!', '', {duration: 3000});
          this.taskService.getSidenavMenuCounts();
          this.refresh();
        }
      });
    }
  }

  changeRoute(url: any, params: any = null) {
    this.router.navigate([url], {
      queryParams: params
    });
  }

  refresh() {
    this.dataSource = null;
    this.getCorrespondences();
  }

  pageChange(event) {
    this.currentPage = event;
    this.dataSource = null;
    this.getCorrespondences();
  }

  public downloadExcelFile() {
    this.fileService.generateExcelFileWithDifferentData( 'export-correspondences', this.sectionName, this.type);
  }

}

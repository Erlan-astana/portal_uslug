import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ProblemService} from '../../../services/problem.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {DirectoryService} from '../../../services/directory.service';
import {FileService} from '../../../services/file.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-adm-documents',
  templateUrl: './adm-documents.component.html',
  styleUrls: ['./adm-documents.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdmDocumentsComponent implements OnInit {
  dataSource: any;
  displayedColumns: string[] = ['position', 'id', 'date', 'category', 'employee', 'action'];
  currentPage = 1;
  pageSize = 10;
  totalElements: number = null;
  currentLang;
  name: string = '';
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
    this.getDocuments();
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
      this.sectionName = params['name'];
    });
  }

  getCount() {
    return (this.currentPage - 1) * 10;
  }


  getDocuments() {
    this.directorySvc.getAdmDocuments(this.currentPage - 1, this.pageSize)
    .pipe(takeUntil(this.destroyed$))
    .subscribe(res => {
      this.dataSource = res.content;
      this.totalElements = res.totalElements;
    });
  }


  getCategories() {
    this.directorySvc.getAdmDocumentCategories()
    .pipe(takeUntil(this.destroyed$))
    .subscribe(res => {
      this.categories = res;
    });
  }

  create(category: any) {
    const params: any = {categoryId: category.id};
    this.changeRoute(`directory/document/create`, params);
  }

  edit(id: number) {
    const params: any = {documentId: id};
    this.changeRoute('directory/document/edit', params);
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
    this.getDocuments();
  }

  pageChange(event) {
    this.currentPage = event;
    this.dataSource = null;
    this.getDocuments();
  }

  public downloadExcelFile() {
    this.fileService.generateExcelFileWithDifferentData( 'export-admdocuments', this.sectionName);
  }


}

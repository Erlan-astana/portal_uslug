import {AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {app} from '../../../shared/models/application.model';
import {ApiService} from '../../../services/api.service';
import {ApplicationService} from '../../../services/application.service';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {auth} from '../../../shared/models/auth.model';
import {AuthService} from '../../../services/auth.service';
import {Sort} from '@angular/material/typings/sort';
import {dic} from '../../../shared/models/dictionary.model';
import FilterTable = dic.FilterTable;
import {SearchOperation} from '../../../shared/utils/constants';
import {TableFilterComponent} from '../../../components/table-filter/table-filter.component';
import {FileService} from '../../../services/file.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-external-fulfulled-tasks',
  templateUrl: './external-&-fulfilled-tasks.component.html',
  styleUrls: ['./external-&-fulfilled-tasks.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ExternalFulfilledTasksComponent implements OnInit, AfterViewInit {
  @ViewChild(TableFilterComponent, {static: false})
  public filterComponent: TableFilterComponent;
  dataSource: app.App[] = [];
  displayedColumns: any[] = ['position', 'id', 'createDate', 'iin', 'firstName', 'type', 'planEndDate'];
  displayedColumnsForFilter: any[] = [
    {name: 'id', type: 'string'},
    {name: 'createDate', type: 'date'},
    {name: 'subservice', type: 'subservice'},
    {name: 'firstName', type: 'string'},
    {name: 'planEndDate', type: 'date'}];
  sortColumns: string = 'sort=createDate,desc';
  sectionId: any;
  taskName: string;
  currentUser: auth.User = null;
  currentLang;
  currentPage = 1;
  pageSize = 20;
  totalElements: number = null;
  isFilterComponent: boolean;
  destroyed$ = new Subject();

  constructor(
    private appSvc: ApplicationService,
    private api: ApiService,
    private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private fileService: FileService
  ) {
  }

  filter() {
    this.getApplications();
  }

  addNewFilter() {
    this.filterComponent.filterTable.push(new FilterTable());
  }

  showFilterComponent() {
    this.isFilterComponent = !this.isFilterComponent;
  }

  ngOnInit() {
    this.initTranslate();
    this.getQueryParams();
  }

  getQueryParams() {
    this.route.queryParams.pipe(takeUntil(this.destroyed$))
      .subscribe(params => {
        this.sectionId = params['id'];
        this.taskName = params['name'];
        this.getCurrentUser();
        this.changeDisplayedColumn();
      });
  }

  initTranslate() {
    this.translate.onLangChange.pipe(takeUntil(this.destroyed$))
      .subscribe((event: any) => {
        this.currentLang = event.lang;
      });
  }

  ngAfterViewInit() {
    this.getApplications();
    this.changeFilterColumn();
  }

  private getCurrentUser() {
    this.currentUser = this.authService.getUser();
  }

  changeDisplayedColumn() {
    if (this.sectionId === '4') {
      this.displayedColumns = this.displayedColumns.concat(['approved', 'factEndDate']);
      if (this.filterComponent) {
        this.filterComponent.displayedColumnsForFilter = this.displayedColumnsForFilter.concat([
          {name: 'approved', type: 'boolean'},
          {name: 'factEndDate', type: 'date'}]);
      }

    }
    if (this.sectionId === '5') {
      this.displayedColumns = this.displayedColumns.concat(['ResponsibleExecutor', 'currentExecutor', 'currentTaskName', 'approved']);
    }
  }

  changeFilterColumn() {
    if (this.sectionId === '4') {
      if (this.filterComponent) {
        this.filterComponent.displayedColumnsForFilter = this.displayedColumnsForFilter.concat([
          {name: 'approved', type: 'boolean'},
          {name: 'factEndDate', type: 'date'}]);
      }
    }
  }

  getApplications() {
    this.getExternalApplications();
  }


  getExternalApplications() {
    this.appSvc.getExternalApplications(this.currentPage - 1, this.pageSize, this.sortColumns,
      this.getDefaultFilterValues()).pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        this.dataSource = res.body.content;
        this.totalElements = res.body.totalElements;
      }, error => {
        this.dataSource = [];
      });
  }

  createApp(row: app.App) {
    this.appSvc.setApp(row);
    if (row.subservice.id === 21) {
      this.changeRouteToSketch(row);
    } else {
      this.changeRouteToApp(row);
    }
  }

  changeRouteToSketch(row: any) {
    const url = '/sketch/view';
    const params = {appId: row.id, sectionId: 3};
    this.changeRoute(url, params);
  }

  changeRouteToApp(row: any) {
    const url = '/arch/app';
    const params = {appId: row.id, sectionId: 3};
    this.changeRoute(url, params);
  }

  changeRoute(url: any, params: any = null) {
    this.router.navigate([url], {
      queryParams: params
    });
  }

  pageChange(event) {
    this.currentPage = event;
    this.dataSource = null;
    this.getApplications();
  }

  refresh() {
    this.dataSource = null;
    this.getApplications();
  }

  getCount() {
    return (this.currentPage - 1) * 50;
  }

  sortData(sort: Sort) {
    if (sort.direction !== '') {
      this.sortColumns = `sort=${sort.active},${sort.direction}`;
    } else {
      this.sortColumns = '';
    }
    this.getApplications();
  }

  getDefaultFilterValues() {
    if (this.sectionId === '33') {
      const appFilter: any = [
        {key: 'archSigned', operation: 'EQUAL', value: false},
        {key: 'open', operation: 'EQUAL', value: true}];
      return appFilter.concat(this.getFilterTable());
    }
    if (this.sectionId === '4') {
      const appFilter: any = [{key: 'archSigned', value: true, operation: 'EQUAL'}];
      return appFilter.concat(this.getFilterTable());
    }
    if (this.sectionId === '5') {
      const appFilter: any = [
        {key: 'archSigned', value: false, operation: 'EQUAL'},
        {key: 'control', value: this.currentUser.username, operation: 'EQUAL'}];
      return appFilter.concat(this.getFilterTable());
    }
  }

  getFilterTable() {
    return this.filterComponent ? this.filterComponent.filterTable : [];
  }

  public downloadExcelFile() {
    this.fileService.generateExcelFileWithApp(this.getDefaultFilterValues(), 'export-gosuslugi', this.taskName,
      this.currentPage - 1, this.pageSize);
  }


}

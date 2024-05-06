import {AfterViewInit, Component, OnChanges, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {dic} from '../../../shared/models/dictionary.model';
import {ProblemService} from '../../../services/problem.service';
import {AuthService} from '../../../services/auth.service';
import {auth} from '../../../shared/models/auth.model';
import {app} from '../../../shared/models/application.model';
import {ActivatedRoute, Router} from '@angular/router';
import {ApplicationService} from '../../../services/application.service';
import {TranslateService} from '@ngx-translate/core';
import {TableFilterComponent} from '../../../components/table-filter/table-filter.component';
import FilterTable = dic.FilterTable;
import {FileService} from '../../../services/file.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {MessageBoxComponent} from '../../../components/message-box/message-box.component';
import {ReassingTaskComponent} from './reassing-task/reassing-task.component';
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";


@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MyTasksComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(TableFilterComponent, {static: false})
  public filterComponent: TableFilterComponent;
  dataSource: dic.Problem[] = [];
  displayedColumns: string[] = ['position', 'id', 'name', 'assignee', 'formKey', 'timer'];
  taskGeneralColumns: string[] = ['position', 'id', 'startTime', 'iin', 'applicant', 'typeRequest', 'name', 'assignee', 'formKey',
    'timer', 'status'];
  taskDesignatedColumns: string[] = ['position', 'id', 'startTime', 'iin', 'applicant', 'typeRequest', 'name', 'formKey', 'timer',
    'status'];
  taskExecutedColumns: string[] = ['position', 'id', 'startTime', 'iin', 'applicant', 'typeRequest', 'name', 'formKey', 'StartTimeTask',
    'endTime', 'status'];
  taskColumns: string[] =
    ['position', 'id', 'startTime', 'iin', 'applicant', 'typeRequest', 'name', 'assignee', 'formKey', 'actions'];
  displayedColumnsForFilter: any[] = [
    {name: 'appId', type: 'int'},
    {name: 'createTime', type: 'date'},
    {name: 'firstName', type: 'string'},
    {name: 'lastName', type: 'string'},
    {name: 'orgName', type: 'string'},
    {name: 'iin', type: 'int'},
    {name: 'bin', type: 'int'},
    {name: 'subserviceId', type: 'subservice'},
    {name: 'taskName', type: 'string'},
    {name: 'dueDate', type: 'date'},
    {name: 'approved', type: 'boolean'}];
  currentUser: auth.User = null;
  sectionId: any;
  taskName: string;
  currentLang;
  currentPage = 1;
  pageSize = 20;
  totalElements: number = null;
  app: app.App = new app.App();
  username: string;
  sort: any = 'signedDate';
  isFilterComponent: boolean;
  destroyed$ = new Subject();
  timerInterval: any;

  constructor(
    private taskService: ProblemService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private appSvc: ApplicationService,
    private translate: TranslateService,
    private fileService: FileService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.initTranslate();
    this.getQueryParams();
  }

  ngAfterViewInit() {
    this.getTasks();
  }


  private setTimer() {
    this.timerInterval = setInterval(() => {
      if (this.dataSource && this.dataSource.length > 0) {
        this.dataSource.map((task: dic.Problem) => {
          task = this.startCountdown(task);
        });
      }
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval);
  }

  startCountdown(task: dic.Problem) {
    const taskRole = this.hasRoleWithHourLimit(task.content.role);
    if (taskRole && taskRole.hoursLimit) {
      const createTime = new Date(task.createTime);
      const currentHours = createTime.getHours();
      createTime.setHours(currentHours + taskRole.hoursLimit);
      task.timerData = this.appSvc.countdown(createTime);
    } else {
      task.timerData = this.appSvc.countdown(new Date(task.content.planEndDate));
    }
    return task;
  }

  private hasRoleWithHourLimit(roleCode) {
    if (roleCode && this.authService.currentOurUser) {
      const role = this.authService.currentOurUser.roles.find(item => item.name === roleCode);
      return role;
    }
  }

  rowColorByTimer(task: dic.Problem) {
    if (task.timerData) {
      if (task.timerData.days < 3 && task.timerData.days > 1) {
        return 'orange';
      } else if (task.timerData.days < 1) {
        return 'red';
      }
    }
  }

  changeFilterColumn() {
    if (this.sectionId === '8') {
      this.displayedColumnsForFilter = this.displayedColumnsForFilter.concat([
        {name: 'executorName', type: 'string'},
      ]);
    }
    if (this.sectionId === '3' || this.sectionId === '44') {
      this.displayedColumnsForFilter = this.displayedColumnsForFilter.concat([
        {name: 'startTime', type: 'date'},
        {name: 'objectAddress', type: 'string'},
        {name: 'endTime', type: 'date'}]);
    }
  }

  initTranslate() {
    this.translate.onLangChange.pipe(takeUntil(this.destroyed$))
      .subscribe((event: any) => {
        this.currentLang = event.lang;
      });
  }

  getQueryParams() {
    this.route.queryParams.pipe(takeUntil(this.destroyed$))
      .subscribe(params => {
        this.sectionId = params['id'];
        this.taskName = params['name'];
        this.username = params['username'];
        this.changeDisplayedColumn();
        this.getCurrentUser();
        this.changeFilterColumn();
      });
  }

  changeDisplayedColumn() {
    if (this.sectionId === '3' || this.sectionId === '44') {
      this.displayedColumns = this.taskExecutedColumns;
    }
    if (this.sectionId === '8') {
      this.displayedColumns = this.taskGeneralColumns;
    }
    if (this.sectionId === '9') {
      this.displayedColumns = this.taskDesignatedColumns;
    }
    if (this.sectionId === '18') {
      this.displayedColumns = this.taskColumns;
    }
  }

  private getCurrentUser() {
    this.currentUser = this.authService.getUser();
  }

  getTasks(event = null) {
    this.sort = event ? event : this.sort;
    if (this.currentUser) {
      if (this.sectionId === '8') {
        this.getPermanceTasks();
      }
      if (this.sectionId === '9') {
        this.getMyTasks();
      }
      if (this.sectionId === '3' || this.sectionId === '44') {
        this.getMyExecutedTasks();
      }
      if (this.sectionId === '18') {
        this.getOperationTasks();
      }
    }

  }

  getOperationTasks() {
    this.taskService.getOperationTasks(this.currentPage - 1, this.pageSize, this.getDefaultFilterValues(), this.sort)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        this.dataSource = res.body.content;
        this.totalElements = res.body.totalElements;
      });
  }

  getPermanceTasks() {
    this.taskService.getTasks(this.currentPage - 1, this.pageSize, this.getDefaultFilterValues(), this.sort)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        this.dataSource = res.body.content;
        this.totalElements = res.body.totalElements;
        this.setTimer();
      });
  }

  getMyTasks() {
    this.taskService.getMyTasks(this.currentPage - 1, this.pageSize, this.getDefaultFilterValues(), this.sort)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        this.dataSource = res.body.content;
        this.totalElements = res.body.totalElements;
        this.setTimer();
      });
  }

  getMyExecutedTasks() {
    this.taskService.getMyExecutedTasks(this.currentPage - 1, this.pageSize, this.getDefaultFilterValues())
      .pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        this.dataSource = res.body.content;
        this.totalElements = res.body.totalElements;
        this.setTimer();
      });
  }

  getDefaultFilterValues() {
    const revokedDefaultValue = {key: 'revoked', operation: 'EQUAL', value: true};
    const finishedDefaultValue = {key: 'finished', operation: 'EQUAL', value: true};
    const assigneeDefaultValue = {
      key: 'assignee',
      operation: 'EQUAL',
      value: this.username ? this.username : this.currentUser.username
    };
    if (this.sectionId === '8' || this.sectionId === '18') {
      const appFilter: any = [];
      return appFilter.concat(this.getFilterTable());
    }
    if (this.sectionId === '9') {
      const appFilter: any = [
        assigneeDefaultValue];
      return appFilter.concat(this.getFilterTable());
    }
    if (this.sectionId === '3') {
      const appFilter: any = [
        assigneeDefaultValue, finishedDefaultValue];
      return appFilter.concat(this.getFilterTable());
    }
    if (this.sectionId === '44') {
      const appFilter: any = [
        assigneeDefaultValue, revokedDefaultValue];
      return appFilter.concat(this.getFilterTable());
    }
  }

  getFilterTable() {
    return this.filterComponent ? this.filterComponent.filterTable : [];
  }


  async showMyTask(task: any) {
    if (this.sectionId !== '18') {
      const serviceId = task.content.subserviceId;
      await this.getTaskVariables(task);
      //this.taskService.setTask(task);

      let url = '';
      if (serviceId === 21 || serviceId === 37 || serviceId === 39 || serviceId === 61 || serviceId === 63) {
        url = '/sketch/study';
      }
      if ([107, 152].includes(serviceId)) {
        url = '/bez-torg-reg/study';
      }
      if (this.redirectToBezTorgReg2subserviceId(serviceId)) {
        url = '/beztorgreg2/study';
      }
      if (this.redirectToZuPlsubserviceId(serviceId)) {
        url = '/zu-pl/study';
      }
      if (this.redicectToCnBySubserviceId(serviceId)) {
        //this.taskService.getExecutors(task);
        url = '/cn/study';
      }
      if (this.redirectToApzBysubserviceId(serviceId)) {
        url = '/apz/study';
      }
      if (this.redirectToCommunalBySubserviceId(serviceId)) {
        url = '/apz/communal-study';
      }
      if (this.redicectToAddressBySubserviceId(serviceId)) {
        url = '/short-service/study';
      }
      if (this.redirectToOwnBysubserviceId(serviceId)) {
        url = '/own/study';
      }
      this.changeRouteToService(task, url);
    }
  }

  redicectToCnBySubserviceId(subserviceId) {
    const availableIds = [25, 50, 23, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 137, 136, 138, 139, 140, 141, 142, 143, 144, 145, 146, 135];
    return availableIds.some(role => role === subserviceId);
  }

  redicectToAddressBySubserviceId(subserviceId) {
    const availableIds = [18, 19, 17, 58, 59, 57, 134, 133, 77];
    return availableIds.some(role => role === subserviceId);
  }

  redirectToApzBysubserviceId(subserviceId) {
    const availableIds = [1, 2, 3, 4, 9, 41, 42, 43, 44, 49];
    return availableIds.some(role => role === subserviceId);
  }

  redirectToCommunalBySubserviceId(subserviceId) {
    const availableIds = [32, 31, 35, 38, 105, 90, 123, 120, 125, 122, 121];
    return availableIds.some(role => role === subserviceId);
  }

  redirectToOwnBysubserviceId(subserviceId) {
    const availableIds = [33, 34, 7, 70, 27, 8, 12];
    return availableIds.some(role => role === subserviceId);
  }

  redirectToBezTorgReg2subserviceId(subserviceId) {
    return [111, 118, 114, 116, 117, 113, 110, 119, 115, 112].includes(subserviceId);
  }

  redirectToZuPlsubserviceId(subserviceId) {
    return [130, 131, 132].includes(subserviceId);
  }

  changeRouteToService(task: any, url) {
    const params = {id: task.id, sectionId: this.sectionId};
    this.changeRoute(url, params);
  }

  getTimeBySectionId(task) {
    return this.sectionId === '3' || this.sectionId === '18' ? task.startTime : task.createTime;
  }

  async getTaskVariables(task) {
    if (this.sectionId === '3' || this.sectionId === '44') {
      await this.taskService.getTaskVariablesById(task.id).toPromise().then(res => {
        const content = this.parsingTaskContent(res);
        this.setTaskContentVariables(task, content);
      });
    }
  }

  public parsingTaskContent(data) {
    const content: any = {};
    data.forEach(({variableName, value}) => {
      content[`${variableName}`] = value;
    });
    return content;
  }

  public setTaskContentVariables(task, content) {
    task.content.internalFiles = content.internalFiles;
    task.content.zkFiles = content.zkFiles;
    task.content.scanFiles = content.scanFiles;
    task.content.message = content.message;
    task.content.assignee = content.from;
    this.taskService.setTask(task);
  }


  getCount() {
    return (this.currentPage - 1) * 50;
  }

  changeRoute(url: any, params: any = null) {
    this.router.navigate([url], {
      queryParams: params
    });
  }

  sendApp(id: number) {
    this.appSvc.sendApplication(id).pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        console.log(res);
      });
  }

  pageChange(event) {
    this.currentPage = event;
    this.taskService.setCurrentPage(event);
    this.getTasks();
  }

  refresh() {
    this.dataSource = null;
    this.getTasks();
  }

  hasColumn(column: string) {
    if (this.displayedColumns.indexOf(column) === -1) {
      return false;
    } else {
      return true;
    }
  }

  showFilterComponent() {
    this.isFilterComponent = !this.isFilterComponent;
  }

  addNewFilter() {
    this.filterComponent.filterTable.push(new FilterTable());
  }

  public downloadExcelFile() {
    if (this.sectionId === '3' || this.sectionId === '44') {
      this.fileService.generateExcelFileWithApp(this.getDefaultFilterValues(), 'export-finishedtasks', this.taskName,
        this.currentPage - 1, this.pageSize);
    } else {
      this.fileService.generateExcelFileWithApp(this.getDefaultFilterValues(), 'export-gosuslugi', this.taskName,
        this.currentPage - 1, this.pageSize);
    }
  }

  delete(task: any) {
    if (confirm(this.currentLang === 'ru' ? `Удалить заявление № ${task.content.regAppId}, ${task.content.firstName} ${task.content.lastName}`
      : `Удалить заявление № ${task.content.regAppId}, ${task.content.firstName} ${task.content.lastName}`)) {
      this.taskService.removeTask(task.processInstanceId, task.content.regAppId).pipe(takeUntil(this.destroyed$))
        .subscribe(res => {
          if (res) {
            this.snackBar.open('Заявление успешно удален!', '', {duration: 3000});
            this.taskService.getSidenavMenuCounts();
            this.refresh();
          }
        });
    }
  }

  restart(task: any) {
    if (confirm(this.currentLang === 'ru' ? `Заявление № ${task.content.regAppId} будет переведено на первый этап. 
    Все вложенные данные будут удалены. Продолжить? `
      : `Заявление № ${task.content.regAppId} будет переведено на первый этап. Все вложенные данные будут удалены. Продолжить? `)) {
      this.taskService.restartTask(task.processInstanceId, task.content.regAppId).pipe(takeUntil(this.destroyed$))
        .subscribe(res => {
          if (res) {
            this.snackBar.open('Заявление успешно обновлен!', '', {duration: 3000});
            this.taskService.getSidenavMenuCounts();
            this.refresh();
          }
        });
    }
  }

  reassignAll() {
    const dialogRef = this.dialog.open(ReassingTaskComponent, {
      width: '450px',
      data: {currentUser: this.currentUser}
    });
  }
}

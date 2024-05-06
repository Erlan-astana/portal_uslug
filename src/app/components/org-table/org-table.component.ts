import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {dic} from '../../shared/models/dictionary.model';
import TaskData = dic.TaskData;
import {app} from '../../shared/models/application.model';
import {ApiService} from '../../services/api.service';
import Organizations = dic.Organizations;
import {SelectionModel} from '@angular/cdk/collections';
import {ApplicationService} from '../../services/application.service';
import {STATUSES} from '../../shared/utils/constants';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FileService} from '../../services/file.service';

@Component({
  selector: 'app-org-table',
  templateUrl: './org-table.component.html',
  styleUrls: ['./org-table.component.scss']
})
export class OrgTableComponent implements OnInit, OnDestroy {
  @Input() task: TaskData = null;
  @Input() app: app.App = null;
  @Input() sectionId: any = null;
  dataSource = new MatTableDataSource<Organizations>();
  displayedColumns = ['id', 'name', 'select', 'file', 'result', 'sendDate', 'responseDate'];
  selection = new SelectionModel<Organizations>(true, []);
  organizations: Organizations[] = [];
  statuses = STATUSES;
  destroyed$ = new Subject();

  constructor(
    private api: ApiService,
    public appSvc: ApplicationService,
    private fileSvc: FileService,
  ) {
  }

  ngOnInit() {
    this.getOrganizations(this.app.regionId);
  }

  getOrganizations(regionId) {
    if (this.task.content.appId) {
      const orgs = this.api.get2('userapp/' + this.task.content.appId + `/orgs?regionId=${regionId}`);
      orgs.pipe(takeUntil(this.destroyed$))
        .subscribe(
          (data) => {
            this.dataSource = new MatTableDataSource(data);
            this.organizations = data;
          }
        );
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row =>
        this.selection.select(row)
      );
  }

  sendOrgStatus() {
    const orgs = this.selection.selected;
    const resp = this.api.post2('userapp/' + this.app.id + '/send/orgs', orgs);
    resp.pipe(takeUntil(this.destroyed$))
      .subscribe(
        (data) => {
          if (data.status === 200) {
            this.setCurrentApp();
          }
        }
      );
  }

  setCurrentApp() {
    const resp = this.appSvc.getAppReq(Number(this.app.id));
    resp.pipe(takeUntil(this.destroyed$))
      .subscribe(
        (data) => {
          data.applicant = (data.lastName ? data.lastName : '') + ' ' +
            (data.firstName ? data.firstName : '') + ' ' +
            (data.secondName ? data.secondName : '');
          this.app = data;
        }
      );
    this.getOrganizations(this.app.regionId);
  }

  downloadTechCondition(org) {
    this.fileSvc.downloadFileReq(org.techCondition.objectId);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}

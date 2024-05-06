import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TableFilterComponent} from '../../../components/table-filter/table-filter.component';
import {TranslateService} from '@ngx-translate/core';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {DirectoryService} from '../../../services/directory.service';
import {SpecregJournalStatus} from '../../../shared/utils/constants';
import {RenumerateComponent} from "../renumerate/renumerate.component";
import {MatDialog} from "@angular/material";
import {AuthService} from "../../../services/auth.service";
import {SpecregExcludeComponent} from "../specreg-exclude/specreg-exclude.component";

@Component({
  selector: 'app-specreg-journal',
  templateUrl: './specreg-journal.component.html',
  styleUrls: ['./specreg-journal.component.scss']
})
export class SpecregJournalComponent implements OnInit, OnDestroy {
  @ViewChild(TableFilterComponent, {static: false})
  public filterComponent: TableFilterComponent;
  dataSource: any;
  displayedColumns: string[] = ['position', 'fio', 'date', 'status', 'action', 'operatorFio'];
  currentPage = 1;
  pageSize = 10;
  totalElements: number = null;
  currentLang;
  destroyed$ = new Subject();
  statusList = SpecregJournalStatus;
  isFilterComponent: boolean;
  displayedColumnsForFilter: any[] = [
    {name: 'specregDate', type: 'date'},
    {name: 'firstName', type: 'string'},
    {name: 'lastName', type: 'string'},
  ];

  constructor(
    private translate: TranslateService,
    private directorySvc: DirectoryService,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    this.currentLang = this.translate.currentLang ? this.translate.currentLang : this.translate.getDefaultLang();

  }

  ngOnInit() {
    this.getDocuments();
    this.initTranslate();
  }

  initTranslate() {
    this.translate.onLangChange
      .pipe(takeUntil(this.destroyed$))
      .subscribe((event: any) => {
        this.currentLang = event.lang;
      });
  }

  showFilterComponent() {
    this.isFilterComponent = !this.isFilterComponent;
  }

  clearFilter() {
    this.filterComponent.filterTable.forEach(f => f.value = '');
  }

  getFilterTable() {
    return this.filterComponent ? this.filterComponent.filterTable : [];
  }

  getDocuments() {
    if (this.authService.currentOurUser) {
      this.directorySvc.getSpecregsJournal(this.authService.currentOurUser.regionId, this.currentPage - 1, this.pageSize)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(res => {
          this.dataSource = res.content;
          this.totalElements = res.totalElements;
        });
    }
  }

  getStatusStr(text) {
    if (text) {
      const status = this.statusList.find(item => text === item.id);
      return status.name;
    }
  }

  refresh() {
    this.dataSource = null;
    this.getDocuments();
  }

  showDialogBox(data) {
    let component: any = RenumerateComponent;
    let dataForTransfer: any = {specreg: data, status: data.operation};
    if (data.operation === 'EXCLUDE') {
      component = SpecregExcludeComponent;
      dataForTransfer = {specregList: [], showSpecregExcluded: false, reasonDetails: data.specregData.toReasonFileUid};
    }
    const dialogRef = this.dialog.open(component, {
      width: '90%',
      data: dataForTransfer
    });
  }

  pageChange(event) {
    this.currentPage = event;
    this.dataSource = null;
    this.getDocuments();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}

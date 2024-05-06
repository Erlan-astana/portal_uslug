import {Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DirectoryService} from '../../services/directory.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SpecregCommisionComponentComponent} from './specreg-commision-component/specreg-commision-component.component';
import {MatDialog, MatSnackBar} from '@angular/material';
import {TableFilterComponent} from '../../components/table-filter/table-filter.component';
import {SpecregStatus} from '../../shared/utils/constants';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {RenumerateComponent} from './renumerate/renumerate.component';
import {MatTableDataSource} from '@angular/material';
import {dic} from '../../shared/models/dictionary.model';
import {SelectionModel} from '@angular/cdk/collections';
import SpecReg = dic.SpecReg;
import {SpecregExcludeComponent} from './specreg-exclude/specreg-exclude.component';
import {AuthService} from "../../services/auth.service";


@Component({
  selector: 'app-specreg',
  templateUrl: './specreg.component.html',
  styleUrls: ['./specreg.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SpecregComponent implements OnInit, OnDestroy {
  @ViewChild(TableFilterComponent, {static: false})
  public filterComponent: TableFilterComponent;
  status = SpecregStatus;
  dataSource = new MatTableDataSource<SpecReg>();
  displayedColumns: string[] = ['position', 'id', 'SpecRegNumber', 'fio', 'iin', 'regAddressRu', 'factAddress',
    'phone', 'SpecregSourceType', 'status', 'SpecregNumberType', 'action'];
  selection = new SelectionModel<SpecReg>(true, []);
  currentPage = 1;
  pageSize = 20;
  totalElements: number = null;
  currentLang;
  name: string = '';
  specregNumberTypes = [{value: 'PRELIMINARY', name: 'Предварительный'},
    {value: 'APPROVED', name: 'Утвержденный'}];
  isFilterComponent: boolean;
  displayedColumnsForFilter: any[] = [
    {name: 'orderNumber', type: 'int'},
    {name: 'specregNumber', type: 'string'},
    {name: 'specregDate', type: 'date'},
    {name: 'specregStatus', type: 'dropdown', options: this.status},
    {name: 'firstName', type: 'string'},
    {name: 'lastName', type: 'string'},
    {name: 'secondName', type: 'string'},
    {name: 'iin', type: 'string'},
    {
      name: 'specregSourceType',
      type: 'dropdown',
      options: [{id: 'RGIS', name: 'Портал РГИС'}, {id: 'Operator', name: 'Оператор'}]
    }
  ];
  statusList = SpecregStatus;
  destroyed$ = new Subject();
  spinnerBlock: boolean;
  waitingList: boolean;
  duplicates: any;

  constructor(
    private translate: TranslateService,
    private directorySvc: DirectoryService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    public authService: AuthService
  ) {
    this.currentLang = this.translate.currentLang ? this.translate.currentLang : this.translate.getDefaultLang();
  }

  ngOnInit() {
    this.initTranslate();
    this.getQueryParams()
      .then(() => {
        this.getDocuments();
      });
  }

  getQueryParams() {
    return new Promise((resolve) => {
      this.route.queryParams
        .pipe(takeUntil(this.destroyed$))
        .subscribe(params => {
          this.waitingList = params['waiting'];
          this.duplicates = params['duplicates'];
          this.showSelectColumn();
          resolve();
        });
    });
  }

  initTranslate() {
    this.translate.onLangChange.pipe(takeUntil(this.destroyed$))
      .subscribe((event: any) => {
        this.currentLang = event.lang;
      });
  }

  getCount() {
    return (this.currentPage - 1) * 10;
  }

  getDocuments() {
    if (this.duplicates !== 'true') {
      this.directorySvc.getSpecregs(this.currentPage - 1, this.pageSize, this.getDefaultFilterValues()).pipe(takeUntil(this.destroyed$))
        .subscribe(res => {
          this.dataSource = new MatTableDataSource(res.body.content);

          this.totalElements = res.body.totalElements;
        });
    } else {
      this.getDuplicates();
    }
  }

  getDuplicates() {
    this.directorySvc.getduplicates(this.currentPage - 1, this.pageSize, this.authService.currentOurUser.regionId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        this.dataSource = new MatTableDataSource(res.content);
        this.totalElements = res.totalElements;
      });
  }

  getSpecregNumberTypeText(text) {
    return this.specregNumberTypes.find(item => text === item.name);
  }

  edit(id: number) {
    const params: any = {specregId: id};
    this.changeRoute('/specreg/edit', params);
  }

  create() {
    this.changeRoute('/specreg/edit');
  }

  cancel() {
    this.changeRoute('/specreg');
  }

  delete(correspondence: any) {
    if (confirm(this.currentLang === 'ru' ? `Удалить Спецучет '${correspondence.id}?'` :
      `Сіз осы Спецучетты өшіргіңіз келе ме? '${correspondence.id}'`)) {
      this.directorySvc.removeSpecreg(correspondence.id)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(res => {
          if (res) {
            this.snackBar.open('Спецучет успешно удален!', '', {duration: 3000});
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

  showDecreeFiles(id) {
    const dialogRef = this.dialog.open(SpecregCommisionComponentComponent, {
      width: '80%',
      data: {specregId: id}
    });
  }

  refresh() {
    this.dataSource.data = [];
    this.getDocuments();
  }

  showFilterComponent() {
    this.isFilterComponent = !this.isFilterComponent;
  }

  redirectToHistory(id) {
    const params: any = {specregId: id};
    this.changeRoute('/specreg/history', params);
  }

  getDefaultFilterValues() {
    const regionDefaultValue = {key: 'regionId', operation: 'EQUAL', value: this.authService.currentOurUser.regionId};
    const appFilter: any = [
      regionDefaultValue
    ];
    return appFilter.concat(this.getFilterTable());

  }

  getFilterTable() {
    return this.filterComponent ? this.filterComponent.filterTable : [];
  }

  pageChange(event) {
    this.currentPage = event;
    this.dataSource.data = [];
    this.getDocuments();
  }

  renumerate() {
    if (this.authService.currentOurUser) {
      this.spinnerBlock = true;
      this.directorySvc.specregRenumetate(this.authService.currentOurUser.regionId).pipe(takeUntil(this.destroyed$)).subscribe(res => {
        this.spinnerBlock = false;
        this.getDocuments();
        this.snackBar.open('Пересчет очереди успешно выполнен!', '', {duration: 3000});
      });
    }
  }

  showRenumerateDialogBox() {
    const dialogRef = this.dialog.open(RenumerateComponent, {
      width: '600px',
      data: null
    });

    dialogRef.afterClosed().pipe(takeUntil(this.destroyed$))
      .subscribe(result => {
        if (result) {
          this.renumerate();
        }
      });
  }

  redirectToWaitingList() {
    const params: any = {waiting: true};
    this.changeRoute('/specreg/waiting', params);
  }

  showDuplicates() {
    const params: any = {waiting: true, duplicates: true};
    this.changeRoute('/specreg/waiting', params);
  }

  showSelectColumn() {
    if (this.waitingList) {
      const selectColumn = ['select'];
      const columnsWitoutAction = this.displayedColumns.filter(col => col !== 'action')
      this.displayedColumns = [...selectColumn, ...columnsWitoutAction];
    }
  }

  showSelectionSpecregs(val) {
    this.directorySvc.setSelectedSpecregs(this.selection.selected);
    const dialogRef = this.dialog.open(SpecregExcludeComponent, {
      width: '90%',
      data: {specregList: this.selection.selected, showSpecregExcluded: val}
    });

    dialogRef.afterClosed().pipe(takeUntil(this.destroyed$))
      .subscribe(result => {
        if (result) {
          this.getDocuments();
          this.selection.clear();
        }
      });
  }

  clearFilter() {
    this.filterComponent.filterTable.forEach(f => f.value = '');
  }

  openCommisionModal() {
    const dialogRef = this.dialog.open(SpecregCommisionComponentComponent, {
      width: '80%',
      data: {specregId: null}
    });
  }

  getStatusStr(text) {
    if (text) {
      const status = this.statusList.find(item => text === item.id);
      return status.name;
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
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */

  /*checkboxLabel(row?: SpecReg): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }*/

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}

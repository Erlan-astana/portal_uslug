import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {DirectoryService} from '../../../services/directory.service';
import {FileService} from '../../../services/file.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-monitoring-contract',
  templateUrl: './monitoring-contract.component.html',
  styleUrls: ['./monitoring-contract.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MonitoringContractComponent implements OnInit {
  dataSource: any[] = [];
  displayedColumns: string[] = ['position', 'subjectName', 'number', 'createDate', 'customer', 'sum', 'author', 'dueDate', 'preDate',
    'mainDate', 'preLateDays', 'mainLateDays'];
  currentPage = 1;
  pageSize = 10;
  totalElements: number = null;
  currentLang;
  name: string = '';
  sort: any = 'date';
  destroyed$ = new Subject();

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private directorySvc: DirectoryService,
    private fileService: FileService
  ) {
    this.currentLang = this.translate.currentLang ? this.translate.currentLang : this.translate.getDefaultLang();

  }

  ngOnInit() {
    this.getContracts();
    this.initTranslate();
  }

  initTranslate() {
    this.translate.onLangChange
    .pipe(takeUntil(this.destroyed$))
    .subscribe((event: any) => {
      this.currentLang = event.lang;
    });
  }

  getContracts(event = null) {
    this.sort = event ? event : this.sort;
    this.dataSource = [];
    this.directorySvc.getMonitoringContracts(this.currentPage - 1, this.pageSize, this.sort)
    .pipe(takeUntil(this.destroyed$))
    .subscribe(res => {
      this.dataSource = res.content;
      this.totalElements = res.totalElements;
    });
  }

  getCount() {
    return (this.currentPage - 1) * 10;
  }

  refresh() {
    this.name = '';
    this.getContracts();
  }

  pageChange(event) {
    this.currentPage = event;
    this.getContracts();
  }

  public downloadExcelFile() {
    this.fileService.generateExcelFileWithDifferentData('export-contracts', 'contracts');
  }

  show(contract) {
    this.directorySvc.setSonitoringContract(contract);
    const params: any = {isMonitoring: true};
    this.changeRoute('/directory/contracts/edit', params);
  }

  changeRoute(url: any, params: any = null) {
    this.router.navigate([url], {
      queryParams: params
    });
  }

}

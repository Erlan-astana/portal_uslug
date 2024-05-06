import {Component, OnDestroy, OnInit} from '@angular/core';
import {AdminService} from '../../../services/admin.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {dic} from '../../../shared/models/dictionary.model';
import {FileService} from '../../../services/file.service';
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  dataSource: any[] = [];
  displayedColumns: string[] = ['position', 'name', 'nameRu', 'shortNameRu', 'description', 'action'];
  currentPage = 1;
  pageSize = 20;
  totalElements: number = null;
  name: string = '';
  destroyed$ = new Subject();

  constructor(
    private adminService: AdminService,
    private router: Router,
    private fileService: FileService,
    private translate: TranslateService
  ) {
  }

  ngOnInit() {
    this.getLastPageNumber();
    this.getSearchInfo();
  }

  public getLastPageNumber() {
    const pageInfo = this.adminService.getPaginationInfo();
    if (pageInfo.name === this.constructor.name) {
      this.currentPage = pageInfo.number;
    }
  }

  public getSearchInfo() {
    const searchInfo = this.adminService.getSearchInfo();
    if (searchInfo && searchInfo.name === this.constructor.name) {
      this.name = searchInfo.value;
      this.getSubservices();
    } else {
      this.getSubservices();
    }
  }


  getCount() {
    return (this.currentPage - 1) * 10;
  }

  getSubservices() {
    this.adminService.setSearchInfo(this.name, this.constructor.name);
    this.adminService.getSubservices(this.currentPage - 1, this.pageSize, this.name)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        this.dataSource = res.content;
        this.totalElements = res.totalElements;
      });
  }

  changeRoute(url: any, params: any = null) {
    this.router.navigate([url], {
      queryParams: params
    });
  }

  pageChange(event) {
    this.currentPage = event;
    this.adminService.setPaginationInfo(this.constructor.name, event);
    this.getSubservices();
  }

  executors(id: number) {
    const param: any = {serviceId: id};
    this.changeRoute(`admin/services/executors`, param);
  }

  edit(id: number) {
    const param: any = {serviceId: id};
    this.changeRoute(`admin/services/edit`, param);
  }

  refresh() {
    this.name = '';
    this.dataSource = null;
    this.getSubservices();
  }

  public downloadExcelFile() {
    this.fileService.generateExcelFileWithDifferentData('export-subservices', 'service');
  }

}

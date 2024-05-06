import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../services/api.service';
import {TranslateService} from '@ngx-translate/core';
import {AdminService} from '../../../services/admin.service';
import {DicApplicationService} from '../../../services/dic.application.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ProblemService} from '../../../services/problem.service';
import {FileService} from '../../../services/file.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReportsComponent implements OnInit {
  searchForm: FormGroup;
  selectedSubservice: any;
  dataSource: any[] = [];
  displayedColumns: string[] = ['position', 'city', 'appId', 'startTime', 'purpose', 'applicant'];
  reserveServices: any;
  currentLang;
  reportTypes: any;
  reportTypesFC: any = false;
  subserviceFormControl = new FormControl();
  currentPage = 1;
  pageSize = 50;
  totalElements: number = null;
  services: any;
  allServices: any = {shortNameRu: 'Все', id: 111};
  iin: any;
  bin: any;
  applicantName: string;
  destroyed$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private adminService: AdminService,
    private translate: TranslateService,
    private dicSvc: DicApplicationService,
    private route: ActivatedRoute,
    private router: Router,
    private taskService: ProblemService,
    private fileService: FileService
  ) {
    this.currentLang = this.translate.currentLang ? this.translate.currentLang : this.translate.getDefaultLang();

  }

  ngOnInit() {
    this.initFormGroup();
    this.getQueryParams();
    this.getReportTypes();
    this.getSubservices();
  }

  getQueryParams() {
    this.route.queryParams
      .pipe(takeUntil(this.destroyed$))
      .subscribe(params => {
        this.iin = parseInt(params['iin']);
        this.bin = parseInt(params['bin']);
        this.applicantName = params['name'];
        this.getReportsByIin();
      });
  }

  getReportsByIin() {
    if (this.iin || this.bin) {
      //this.reportTypesFC = {code: 'R01v1', nameRu: 'Список исполненных заявлений'};
      if (this.bin) {
        this.searchForm.controls.bin.setValue(this.bin);
      } else {
        this.searchForm.controls.iin.setValue(this.iin);
      }
      this.search();
    }
  }

  getReportTypes() {
    this.adminService.getReportTypes()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        this.reportTypes = res;
      });
  }

  private initFormGroup() {
    this.searchForm = this.fb.group({
      startDate: [null],
      endDate: [null],
      iin: [null, [Validators.minLength(12)]],
      bin: [null, [Validators.minLength(12)]]
    });
  }

  get formControls() {
    return this.searchForm.controls;
  }

  public checkEventValueType(evt: any) {
    if (evt.which !== 8 && isNaN(Number(String.fromCharCode(evt.which)))) {
      evt.preventDefault();
    }
  }

  getSubservices() {
    this.dicSvc.getAllSubServiceReq()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data: any) => {
        this.services = data;
        this.reserveServices = data;
      });
  }

  search() {
    if (!this.searchForm.invalid) {
      const body = this.getReportCriterion();

      this.dataSource = [];
      this.adminService.getReport(this.currentPage - 1, this.pageSize, body)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(res => {
          this.dataSource = res.body.content;
          this.totalElements = res.body.totalElements;
        });
    }
  }

  export() {
    if (!this.searchForm.invalid) {
      const body = this.getReportCriterion();
      this.dataSource = [];
      this.adminService.getReportforExport(this.currentPage - 1, this.pageSize, body)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(data => {
          this.fileService.downloadGeneratedFile(data, 'Отчет.xlsx');
        });
    }
  }

  getReportCriterion() {
    let body: any[] = [];
    if (this.subserviceFormControl.value) {
      body = this.subserviceFormControl.value.map(item => {
        if (item.id !== 111) {
          return {key: 'subservice', operation: 'EQUAL', value: item.id};
        }
        if (item.id !== 113) {
          return {key: 'subservice', operation: 'EQUAL', value: 1};
        }
      });
    }
    if (this.searchForm.controls.startDate.value) {
      body = body.concat([{key: 'factEndDate', operation: 'GREATER_THAN', value: this.searchForm.controls.startDate.value}]);
    }
    if (this.searchForm.controls.endDate.value) {
      body = body.concat([{key: 'factEndDate', operation: 'LESS_THAN', value: this.searchForm.controls.endDate.value}]);
    }

    body = body.concat([{key: 'approved', operation: 'EQUAL', value: this.reportTypesFC}]);

    body = body.filter(element => {
      return element !== undefined;
    });

    return body;
  }

  getCount() {
    return (this.currentPage - 1) * 50;
  }

  pageChange(event) {
    this.currentPage = event;
    this.search();
  }

  searchByServices(query: string) {
    const result = this.adminService.optionSelect(query, this.services, 'shortNameRu');
    this.reserveServices = result;
  }

  showTask(task: any) {
    if (this.iin || this.bin) {
      const url = '/sketch/study';
      const params = {id: task.id, sectionId: 3};
      this.taskService.setTask(task);
      this.changeRoute(url, params);
    }
  }

  changeRoute(url: any, params: any = null) {
    this.router.navigate([url], {
      queryParams: params
    });
  }


}

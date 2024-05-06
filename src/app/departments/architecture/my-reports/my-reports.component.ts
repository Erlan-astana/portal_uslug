import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ProblemService} from '../../../services/problem.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDatepicker, MatDatepickerInputEvent, MatInput, MatSnackBar} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {DirectoryService} from '../../../services/directory.service';
import {FileService} from '../../../services/file.service';
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";

@Component({
  selector: 'app-my-reports',
  templateUrl: './my-reports.component.html',
  styleUrls: ['./my-reports.component.scss']
})
export class MyReportsComponent implements OnInit {
  @ViewChild('fromInput', {static: false, read: MatInput})
  private fromInput: MatInput;
  @ViewChild('byInput', {static: false, read: MatInput})
  private byInput: MatInput;
  dataSource: any;
  displayedColumns: string[] = ['position', 'id', 'roleName', 'username', 'subservice'];
  currentLang;
  name: string = '';
  sectionName: string;
  type: string;
  fromDate: any = '';
  toDate: any = '';
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
        this.sectionName = params['name'];
      });
  }

  changeDateAtBetweenOperation(event: MatDatepickerInputEvent<Date>, type) {
    if (type === 'from') {
      this.fromDate = event.value.getTime();
    }
    if (type === 'by') {
      event.value.setHours(23, 59, 59, 999);
      this.toDate = event.value.getTime();
    }
  }


  getDocuments() {
    this.directorySvc.getMyReports(this.fromDate, this.toDate).pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        this.dataSource = res;
      });
  }


  goToMyTasks(data: any) {
    const params: any = {id: 3, name: 'ContractorReport', username: data.userRole.user.username};
    this.changeRoute(`arch/finishedTasks`, params);
  }

  changeRoute(url: any, params: any = null) {
    this.router.navigate([url], {
      queryParams: params
    });
  }

  refresh() {
    this.fromDate = '';
    this.toDate = '';
    this.fromInput.value = '';
    this.byInput.value = '';
    this.dataSource = null;
    this.getDocuments();
  }

  public downloadExcelFile() {
    this.fileService.generateExcelFileWithDifferentData('export-executorstats', 'executorstats');
  }

}

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProblemService} from '../../../services/problem.service';
import {Task} from 'protractor/built/taskScheduler';
import {AdminService} from '../../../services/admin.service';
import {dic} from '../../../shared/models/dictionary.model';
import TaskContent = dic.TaskContent;
import TaskData = dic.TaskData;
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-ozo-history',
  templateUrl: './ozo-history.component.html',
  styleUrls: ['./ozo-history.component.scss']
})
export class OzoHistoryComponent implements OnInit {
  historyId: number;
  history: any;
  destroyed$ = new Subject();
  constructor(
    private route: ActivatedRoute,
    private taskService: ProblemService,
    private adminService: AdminService
  ) {
  }

  ngOnInit() {
    this.getQueryParams();
  }

  getQueryParams() {
    this.route.queryParams
    .pipe(takeUntil(this.destroyed$))
    .subscribe(params => {
      this.historyId = params['id'];
      console.log(this.historyId);
      this.getHistory();
    });
  }

  getHistory() {
    this.taskService.getHistoryById(this.historyId)
    .pipe(takeUntil(this.destroyed$))
    .subscribe(res => {
      this.history = res[0];
    });
  }

  goBack() {
    this.adminService.goBack();
  }

  public setText(text) {
    console.log(text);
  }

}

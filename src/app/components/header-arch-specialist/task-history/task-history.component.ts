import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Router} from '@angular/router';

@Component({
  selector: 'app-task-history',
  templateUrl: './task-history.component.html',
  styleUrls: ['./task-history.component.scss']
})
export class TaskHistoryComponent implements OnInit {
  displayedColumns: string[] = ['name', 'startTime', 'endTime', 'executorName', 'action'];
  dataSource = [];

  constructor(
    public dialogRef: MatDialogRef<TaskHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.dataSource = this.data.message;
  }

  onOkClick(): void {
    this.dialogRef.close();
  }

  showTaskHistory(task) {
    this.changeRouteToOzoHistory(task);
    this.onOkClick();
  }

  changeRouteToOzoHistory(task: any) {
    const url = '/cn/history';
    const params = {id: task.id};
    this.changeRoute(url, params);
  }

  changeRoute(url: any, params: any = null) {
    this.router.navigate([url], {
      queryParams: params
    });
  }
}

import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {AdminService} from '../../../../services/admin.service';
import {auth} from '../../../../shared/models/auth.model';
import User = auth.User;
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";

@Component({
  selector: 'app-reassing-task',
  templateUrl: './reassing-task.component.html',
  styleUrls: ['./reassing-task.component.scss']
})
export class ReassingTaskComponent implements OnInit, OnDestroy {
  users: User[] = [];
  reserveUsers: User[] = [];
  userContent: boolean;
  selectedUser: User = null;
  destroyed$ = new Subject();

  constructor(
    public dialogRef: MatDialogRef<ReassingTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public adminService: AdminService,
    private snackBar: MatSnackBar,
  ) {
  }

  ngOnInit() {
  }

  close(): void {
    this.dialogRef.close();
  }

  continue() {
    this.getUsers();
    this.userContent = true;
  }

  getUsers() {
    this.adminService.getUsersWithoutPage()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        this.users = this.adminService.sortDataByField(res, 'username');
        this.reserveUsers = this.users;
      });
  }

  searchByUsers(query: string) {
    const result = this.adminService.optionSelect(query, this.users, 'firstName', 'lastName', 'username');
    this.reserveUsers = result;
  }

  reassingTasks() {
    if (this.userContent && this.selectedUser) {
      const body = {
        currentAssignee: this.data.currentUser.username,
        newAssignee: this.selectedUser
      };
      this.adminService.updateTasksAssignees(body)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(res => {
          this.snackBar.open('Все заявлений успешно переназначены!', '', {duration: 3000});
          this.close();
        }, error => {
          this.snackBar.open('Упс, ошибка!', '', {duration: 3000});
        });
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}

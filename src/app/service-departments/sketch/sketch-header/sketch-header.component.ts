import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {ApplicationService} from '../../../services/application.service';
import {app} from '../../../shared/models/application.model';
import {MessageBoxComponent} from '../../../components/message-box/message-box.component';
import {MatDatepicker, MatDialog, MatSnackBar} from '@angular/material';
import {ProblemService} from '../../../services/problem.service';
import {dic} from '../../../shared/models/dictionary.model';
import {AdminService} from '../../../services/admin.service';
import { pipe, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-sketch-header',
  templateUrl: './sketch-header.component.html',
  styleUrls: ['./sketch-header.component.scss']
})
export class SketchHeaderComponent implements OnInit {
  @Input() app: app.App;
  reserveApp: app.App = new app.App();
  @Input() task: dic.TaskData;
  @Input() sectionId: string;
  @Input() currentUser: any;
  @ViewChild(MatDatepicker, {static: false}) picker: MatDatepicker<Date>;
  hasZemkomHead: boolean;
  destroyed$ = new Subject();

  constructor(
    private appSvc: ApplicationService,
    public dialog: MatDialog,
    private taskService: ProblemService,
    private adminService: AdminService,
    private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.taskService.matchingData(this.app, this.reserveApp);
    if (this.task.content.subserviceId === 23 || this.task.content.subserviceId === 21) {
      this.getUserRoles();
    }
  }

  generateRegistrationNumberAndDate() {
    this.reserveApp.numerationDate.setHours(6);
    this.appSvc.generateRegistrationNumber(this.app.id, {
      numeration: this.reserveApp.numeration,
      numerationDate: this.reserveApp.numerationDate
    })
    .pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        this.setApp(this.reserveApp);
      });

  }

  updateApp() {
    this.appSvc.updateApp(this.reserveApp.id, this.reserveApp, () => {
      this.snackBar.open('Успешно !', '', {duration: 3000});
    });
  }

  setApp(application: app.App) {
    this.appSvc.subjectApp.next(application);
  }

  getUserRoles() {
    if (this.currentUser) {
      this.adminService.getUserRoles(this.currentUser.username)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        this.checkOnSpecificRoles(res);
      });
    }
  }

  checkOnSpecificRoles(res) {
    const taskName = this.task.name.toLocaleLowerCase();
    if (taskName.includes('подписание')) {
      this.hasZemkomHead = res.some(roles =>
        roles.role.name === 'UZP_HEAD' || roles.role.name === 'PRELIMDESIGN_HEAD'
      );
    }
    if (this.hasZemkomHead) {
      this.taskService.sendHeadSubject(true);
    }
  }


  hasService(service: string) {
    return this.taskService.checkHasService(service, this.task.name);
  }
}

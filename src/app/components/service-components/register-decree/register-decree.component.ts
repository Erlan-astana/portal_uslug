import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {ApplicationService} from '../../../services/application.service';
import {app} from '../../../shared/models/application.model';
import {MessageBoxComponent} from '../../message-box/message-box.component';
import {MatDatepicker, MatDialog} from '@angular/material';
import {ProblemService} from '../../../services/problem.service';
import {dic} from '../../../shared/models/dictionary.model';
import {AdminService} from '../../../services/admin.service';

@Component({
  selector: 'app-register-decree',
  templateUrl: './register-decree.component.html',
  styleUrls: ['./register-decree.component.scss']
})
export class RegisterDecreeComponent implements OnInit {
  @Input() app: app.App;
  reserveApp: app.App = new app.App();
  @Input() task: dic.TaskData;
  @Input() sectionId: string;
  @Input() currentUser: any;
  @ViewChild(MatDatepicker, {static: false}) picker: MatDatepicker<Date>;

  constructor(
    private appSvc: ApplicationService,
    public dialog: MatDialog,
    private taskService: ProblemService,
    private adminService: AdminService) {
  }

  ngOnInit() {
    this.taskService.matchingData(this.app, this.reserveApp);
  }

  generateRegistrationNumberAndDate() {
    if (this.reserveApp.numerationDate) {
      this.reserveApp.numerationDate.setHours(6);
      this.appSvc.generateRegistrationNumber(this.app.id, {
        numeration: this.reserveApp.numeration,
        numerationDate: this.reserveApp.numerationDate,
        approved: this.task.content.approved
      })
        .subscribe(res => {
          this.setApp(this.reserveApp);
        });
    }
  }

  public checkTaskRoles() {
    return this.taskService.checkTaskRolesForRegisterDecree(this.task.content.role);
  }

  setApp(application: app.App) {
    this.appSvc.subjectApp.next(application);
  }

  showDialogBox(text) {
    const dialogRef = this.dialog.open(MessageBoxComponent, {
      width: '600px',
      data: {message: text}
    });
  }

  hasService(service: string) {
    return this.taskService.checkHasService(service, this.task.name);
  }
}

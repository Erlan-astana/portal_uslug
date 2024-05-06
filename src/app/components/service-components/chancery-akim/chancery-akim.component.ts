import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {ProblemService} from '../../../services/problem.service';
import {dic} from '../../../shared/models/dictionary.model';
import {ApplicationService} from '../../../services/application.service';
import {app} from '../../../shared/models/application.model';
import Decide = dic.Decide;
import App = app.App;
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";

@Component({
  selector: 'app-chancery-akim',
  templateUrl: './chancery-akim.component.html',
  styleUrls: ['./chancery-akim.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChanceryAkimComponent implements OnInit {
  @Input() taskDecide: Decide = new Decide();
  @Input() task: dic.TaskData;
  @Input() app: App;
  @Input() currentUser: any;
  @Output() refreshResultFiles = new EventEmitter<any>();
  @Input() sectionId: any = null;
  destroyed$ = new Subject();
  fileCategories: any[] = [
    {
      extensions: 'application/pdf',
      id: 555,
      required: true,
      subserviceId: 21,
      title: 'Электронная копия постановления (решения)',
      type: 'CN_ACT',
      categoryFiles: [],
      categoryFilesUpload: []
    }
  ];
  constructor(
    public taskService: ProblemService,
    public appSvc: ApplicationService
  ) {
  }

  ngOnInit() {
  }

  public checkTaskRoles() {
    return this.taskService.checkTaskRolesForChanceryAkim(this.taskDecide.role);
  }

  setParentTaskDecide() {
    this.taskService.sendTaskDecideSubject(this.taskDecide);
  }

  public onDate(event): any {
    const date = event.target.value.split('.');
    this.taskDecide.date = new Date(date[2], date[1] - 1, date[0]);
  }

  updateTask(data: any = null) {
    if (data.decide) {
      this.taskDecide = this.taskService.removeUnnecessaryFieldsFromDecide(this.taskDecide);
      if (data.fileCategory === 'CN_ACT') {
        this.taskDecide.scanFiles = data.decide.scanFiles;
      }
      if (data.fileCategory === 'conclusionForZK') {
        this.taskDecide.zkFiles = data.decide.zkFiles;
      }
      this.taskService.refreshTask(this.task.processInstanceId, this.taskDecide)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(res => {
          this.taskService.sendTaskDecideSubject(res.body);
        });
    }
  }

  generateRegistrationNumberAndDate() {
    const data: any = {
      numeration: this.taskDecide.number,
      numerationDate: this.taskDecide.date,
      approved: this.taskDecide.approved
    };
   /* if (this.taskDecide.role === 'UZP_CITY_KONC1' || this.taskDecide.role === 'CN_CITY_SCAN_POST') {
      data.fileCategory = 'ORDINANCE';
    }*/
    this.appSvc.generateRegistrationNumber(this.app.id, data)
      .subscribe(res => {
        this.refreshResultFiles.emit();
      });

  }
}

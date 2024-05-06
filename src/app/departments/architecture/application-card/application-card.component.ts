import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {app} from '../../../shared/models/application.model';
import {ApplicationService} from '../../../services/application.service';
import {dic} from '../../../shared/models/dictionary.model';
import Service = dic.Service;
import {MatDialog} from '@angular/material';


@Component({
  selector: 'app-application-card',
  templateUrl: './application-card.component.html',
  styleUrls: ['./application-card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ApplicationCardComponent implements OnInit {
  appId: number;
  app: app.App = new app.App();
  nodata = 'нет данных';
  sketchProjectSubServiceId = 21;
  task: dic.TaskData = new dic.TaskData();
  sectionId: number;
  constructor(
    public route: ActivatedRoute,
    public appSvc: ApplicationService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.route
      .queryParams
      .subscribe(params => {
        this.appId = params['appId'];
        this.sectionId = params['sectionId'];
        this.getApplication();
      });
  }

  getApplication() {
    this.app = this.appSvc.getApp();
    if (this.app.numerationDate) {
      this.app.numerationDate = new Date(this.app.numerationDate);
    }
    this.app.subservice.service = new Service();
  }

  goBack() {
    this.appSvc.goBack();
  }


}

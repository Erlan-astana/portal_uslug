import {Component, OnInit} from '@angular/core';
import {ApplicationCardComponent} from '../../../departments/architecture/application-card/application-card.component';
import {ActivatedRoute} from '@angular/router';
import {ApplicationService} from '../../../services/application.service';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-sketch-view-card',
  templateUrl: './sketch-view-card.component.html',
  styleUrls: ['./sketch-view-card.component.scss']
})
export class SketchViewCardComponent extends ApplicationCardComponent implements OnInit {

  constructor(
    public route: ActivatedRoute,
    public appSvc: ApplicationService,
    public dialog: MatDialog
  ) {
    super(route, appSvc, dialog);
  }

  ngOnInit() {
    super.ngOnInit();
  }

}

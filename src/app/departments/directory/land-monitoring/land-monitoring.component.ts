import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AdminService} from '../../../services/admin.service';
import {app} from '../../../shared/models/application.model';
import {DirectoryService} from '../../../services/directory.service';
import {ArchMapComponent} from '../../../components/arch-map/arch-map.component';
import {GeomService} from '../../../services/geom.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-land-monitoring',
  templateUrl: './land-monitoring.component.html',
  styleUrls: ['./land-monitoring.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LandMonitoringComponent implements OnInit {
  landForm: FormGroup;
  app = new app.App();
  dataSource: any[] = [];
  displayedColumns: string[] = ['position', 'appId', 'applicant', 'iin', 'service', 'address'];
  intersectApps: any[] = [];
  currentPage = 1;
  pageSize = 50;
  totalElements: number = null;
  destroyed$ = new Subject();

  @ViewChild(ArchMapComponent, {static: false})
  public mapComponent: ArchMapComponent;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private directorySvc: DirectoryService,
    private geomSvc: GeomService
  ) {
  }

  ngOnInit() {
    this.initLoginForm();
  }

  private initLoginForm() {
    this.landForm = this.fb.group({
      id: [''],
      appId: [''],
      firstname: [''],
      bin: [''],
      lastname: [''],
      iin: [''],
      orgname: [''],
      address: [''],
    });
  }

  get userFormControls() {
    return this.landForm.controls;
  }

  getCompletedApplications() {
    if (!this.landForm.invalid) {
      this.directorySvc.getCompletedApplications(this.landForm.value, this.currentPage, this.pageSize)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        console.log(res);
        this.dataSource = res.body.content;
        this.totalElements = res.body.totalElements;
      });
    }
  }

  setApplicationInForm(application) {
    this.adminService.setForm(this.landForm.controls, application);
  }

  pageChange(event) {
    this.currentPage = event;
    this.getCompletedApplications();
  }

  goBack() {
    this.adminService.goBack();
  }

  getCount() {
    return (this.currentPage - 1) * 50;
  }

  showApp(application) {
    const parse = require('wellknown');
    const geoJson = {geometry: parse(application.geom)};
    this.geomSvc.showPolygon(this.mapComponent.map, JSON.stringify(geoJson), 'green');

    this.getIntersectApplications(application.gid);
  }

  getIntersectApplications(gid) {
    this.directorySvc.getIntersectApplications(gid)
    .pipe(takeUntil(this.destroyed$))
    .subscribe(res => {
      this.intersectApps = res.content;
    });
  }
}

import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {AdminService} from '../../../services/admin.service';
import {MatSnackBar} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {dic} from '../../../shared/models/dictionary.model';
import Subservices = dic.Subservices;
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";

@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.scss']
})
export class ServiceFormComponent implements OnInit {
  serviceId: number;
  subservice: Subservices = new Subservices();
  serviceForm: FormGroup;
  submitted = false;
  destroyed$ = new Subject();
  constructor(
    private location: Location,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.route.queryParams.pipe(takeUntil(this.destroyed$))
      .subscribe(params => {
      this.serviceId = params['serviceId'];
      this.getServiceById();
      this.initForm();
    });
  }

  getServiceById() {
    if (this.serviceId) {
      this.adminService.getServiceById(this.serviceId).pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        this.subservice = res;
        this.setServiceForm();
      });
    }
  }

  setServiceForm() {
    this.adminService.setForm(this.formControls, this.subservice);
  }

  private initForm() {
    this.serviceForm = this.fb.group({
      id: [''],
      nameEn: [''],
      nameKk: [''],
      nameRu: ['', [Validators.required]],
      shortNameRu: ['', [Validators.required]],
      shortNameKk: [''],
      shortNameEn: [''],
      days: [''],
      service: [this.subservice.service],
      workdaysOnly: [''],
      code: [''],
    });
  }

  get formControls() {
    return this.serviceForm.controls;
  }

  update() {
    this.submitted = true;
    if (this.serviceForm.invalid) {
      return;
    }
    this.adminService.updateSubservice(this.serviceForm.value).pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
      this.adminService.openSkackbar('БП успешно редактирован');
      this.adminService.goBack();
    });
  }

  cancel() {
    this.serviceForm.reset();
    this.adminService.goBack();
  }


}

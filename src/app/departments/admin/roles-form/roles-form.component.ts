import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Location} from '@angular/common';
import {AdminService} from '../../../services/admin.service';
import {MatSnackBar} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {dic} from '../../../shared/models/dictionary.model';
import Subservices = dic.Subservices;
import Role = dic.Role;
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";

@Component({
  selector: 'app-roles-form',
  templateUrl: './roles-form.component.html',
  styleUrls: ['./roles-form.component.scss']
})
export class RolesFormComponent implements OnInit {
  roleForm: FormGroup;
  submitted = false;
  roleId: number;
  serviceId: number;
  subservice: Subservices = new Subservices();
  destroyed$ = new Subject();
  constructor(
    private fb: FormBuilder,
    private location: Location,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.route.queryParams.pipe(takeUntil(this.destroyed$))
      .subscribe(params => {
      this.roleId = params['roleId'];
      this.serviceId = params['serviceId'];
      this.getRoleById();
      this.getServiceById();
    });
    this.initForm();
  }

  getServiceById() {
    if (this.serviceId) {
      this.adminService.getServiceById(this.serviceId).pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        this.subservice = res;
      });
    }
  }

  getRoleById() {
    if (this.roleId) {
      this.adminService.getRole(this.roleId).pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        if (res) {
          this.setRole(res);
        }
      });
    }
  }

  setRole(role: any) {
    this.adminService.setForm(this.formControls, role);
  }

  private initForm() {
    this.roleForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      nameRu: ['', [Validators.required]],
      nameKk: [''],
      hoursLimit: [''],
      shortNameKk: [''],
      shortNameRu: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      num: ['', [Validators.required]]
    });
  }

  get formControls() {
    return this.roleForm.controls;
  }

  addRole() {
    if (this.fieldsVerification()) {
      this.adminService.addRole(this.roleForm.value).pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        if (res) {
          this.snackBar.open('Роль добавлен успешно!', '', {duration: 3000});
          this.addRoleToSubservice(res.body);
        }
      });
    }
  }

  addRoleToSubservice(role) {
    this.roleId = role.id;
    const data: any = {
      role: {id: role.id},
      subservice: {id: this.serviceId}
    };
    this.saveRoleAndService(data);
  }

  saveRoleAndService(data: any) {
    this.adminService.setSubserviceInRole(data, this.roleId).pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
      if (res) {
        this.snackBar.open('В Роль успешно добавлено БП', null, {
          duration: 3000
        });
        this.adminService.goBack();
      }
    });
  }

  update() {
    if (this.fieldsVerification()) {
      this.adminService.updateRole(this.roleForm.value).pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        if (res) {
          this.snackBar.open('Роль успешно обновлен!', '', {duration: 3000});
          this.adminService.goBack();
        }
      });
    }
  }

  fieldsVerification() {
    this.submitted = true;
    if (this.roleForm.invalid) {
      return false;
    } else {
      return true;
    }
  }

  cancel() {
    this.roleForm.reset();
    this.adminService.goBack();
  }

  goBack() {
    this.adminService.goBack();
  }
}

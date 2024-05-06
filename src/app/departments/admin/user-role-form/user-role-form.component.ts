import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DicApplicationService} from '../../../services/dic.application.service';
import {AdminService} from '../../../services/admin.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {pairwise, takeUntil} from 'rxjs/operators';
import {Subject} from "rxjs";

@Component({
  selector: 'app-user-role-form',
  templateUrl: './user-role-form.component.html',
  styleUrls: ['./user-role-form.component.scss']
})
export class UserRoleFormComponent implements OnInit {
  userRoleForm: FormGroup;
  roles: any[] = [];
  subservices: any[] = [];
  destroyed$ = new Subject();
  constructor(
    private fb: FormBuilder,
    private dicSvc: DicApplicationService,
    private adminService: AdminService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UserRoleFormComponent>,
  ) {
  }

  ngOnInit() {
    this.getSubservices();
    this.initForm();
    this.setRoleAndSubservice();
  }

  initForm() {
    this.userRoleForm = this.fb.group({
      roleId: ['', [Validators.required]],
      serviceId: ['', [Validators.required]],
      current: ['', [Validators.required]]
    });
  }

  getSubservices() {
    this.dicSvc.getAllSubServiceReq().pipe(takeUntil(this.destroyed$))
      .subscribe((data: any) => {
      this.subservices = data;
    });
  }

  getRoles(subserviceId) {
    this.roles = [];
    this.adminService.getRoles(subserviceId).pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
      this.roles = res.content;
    });
  }

  get formControls() {
    return this.userRoleForm.controls;
  }

  setRoleAndSubservice() {
    if (this.data.userRole) {
      this.getRoles(this.data.userRole.subservice.id);
      this.formControls['serviceId'].setValue(this.data.userRole.subservice.id);
      this.formControls['roleId'].setValue(this.data.userRole.role.id);
      this.formControls['current'].setValue(this.data.userRole.current);
    }
  }

  close() {
    this.dialogRef.close();
  }

  saveRoleAndSubservice() {
    const data = this.dataPreparation();
    if (this.data.userRole) {
      this.update(data);
    } else {
      this.save(data);
    }
  }

  update(data) {
    this.adminService.updateUserRoleAndSubservice(data, this.data.userRole.id).pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
      this.dialogRef.close(res);
    });
  }

  save(data) {
    this.adminService.giveUserRoleAndSubservice(data).pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
      this.dialogRef.close(res);
    });
  }

  dataPreparation() {
    const data: any = {
      username: this.data.user.username,
      role: {id: this.formControls['roleId'].value},
      subservice: {id: this.formControls['serviceId'].value},
      current: this.formControls['current'].value
    };
    return data;
  }

  serviceChange(event) {
    this.getRoles(event.value);
  }

}

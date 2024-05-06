import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {app} from '../../shared/models/application.model';
import {dic} from '../../shared/models/dictionary.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ProblemService} from '../../services/problem.service';
import {AdminService} from '../../services/admin.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import SpecReg = dic.SpecReg;
import {DynamicFormComponent} from '../dynamic-form/dynamic-form.component';
import {MatSnackBar} from '@angular/material';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-queuing-form',
  templateUrl: './queuing-form.component.html',
  styleUrls: ['./queuing-form.component.scss']
})
export class QueuingFormComponent implements OnInit {
  @Input() app: app.App;
  @Input() task: dic.Problem;
  @Output() setOrderNumber = new EventEmitter<any>();
  isSpecregNumber: boolean;
  destroyed$ = new Subject();
  specreg: SpecReg = new SpecReg();
  formFields = [
    {
      key: 'id',
      type: 'number',
      required: false
    },
    {
      key: 'orderNumber',
      type: 'number',
      required: false,
      controlType: 'number',
      label: 'SpecregNumberType',
      disabled: true
    },
    {
      key: 'specregNumber',
      type: 'string',
      required: false,
      controlType: 'textbox',
      label: 'specregNumber',
      disabled: true
    },
    {
      key: 'specregSourceType',
      type: 'string',
      required: false
    },
    {
      key: 'specregStatus',
      type: 'string',
      required: false
    },
    {
      key: 'specregDate',
      type: 'string',
      required: false
    },
    {
      key: 'regAddressRu',
      type: 'string',
      required: false,
      controlType: 'textarea',
      label: 'Address',
      disabled: true
    },
    {
      key: 'phone',
      type: 'string',
      required: false,
      controlType: 'textbox',
      label: 'PhoneNumber',
      disabled: true
    },
    {
      key: 'appId',
      type: 'string',
      required: false
    },
    {
      key: 'iin',
      type: 'number',
      required: false
    },
    {
      key: 'regionId',
      type: 'number',
      required: false
    },
    {
      key: 'secondName',
      type: 'string',
      required: false
    },
    {
      key: 'firstName',
      type: 'string',
      required: false
    },
    {
      key: 'lastName',
      type: 'string',
      required: false
    },
  ];
  @ViewChild(DynamicFormComponent, {static: false})
  public formComponent: DynamicFormComponent;

  constructor(
    private fb: FormBuilder,
    private taskService: ProblemService,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    public authService: AuthService
  ) {
  }

  ngOnInit() {
    this.getSpecregByAppId();
  }

  getSpecregByAppId() {
    //if (this.task.content.role === 'SPECREG_DECISION') {
      this.taskService.getSpecregByAppId(this.app.id).pipe(takeUntil(this.destroyed$))
        .subscribe(res => {
          this.specreg = res;
          this.adminService.setForm(this.formComponent.documentForm.controls, this.specreg);
          //this.copyFromApp();
        });
    //}
  }

  createSpecreg() {
    if (this.authService.currentOurUser) {
      this.taskService.createSpecregByAppId(this.app.id, this.authService.currentOurUser.regionId).pipe(takeUntil(this.destroyed$))
        .subscribe(res => {
          this.getSpecregByAppId();
        });
    }
  }

  copyFromApp() {
    if (this.app) {
      this.isSpecregNumber = true;
      this.formComponent.documentForm.controls['specregNumber'].setValue(this.app.id);
      this.formComponent.documentForm.controls['regAddressRu'].setValue(this.app.address);
      this.formComponent.documentForm.controls['phone'].setValue(this.app.phone);
      this.formComponent.documentForm.controls['iin'].setValue(this.app.iin);
      this.formComponent.documentForm.controls['regionId'].setValue(this.app.regionId);
      this.formComponent.documentForm.controls['secondName'].setValue(this.app.secondName);
      this.formComponent.documentForm.controls['firstName'].setValue(this.app.firstName);
      this.formComponent.documentForm.controls['lastName'].setValue(this.app.lastName);
    }
  }

  validateForm() {
    if (this.formComponent.documentForm.invalid) {
      return false;
    }
    this.setOrderNumber.emit(this.specreg.orderNumber);
    const specreg = this.formComponent.documentForm.getRawValue();
    if (specreg.id) {
      this.update();
    } else {
      this.save();
    }
  }

  update() {
    this.taskService.updateSpecreg(this.formComponent.documentForm.getRawValue()).pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        this.snackBar.open('Успешно!', '', {duration: 3000});
      });
  }

  save() {
    this.taskService.saveSpecreg(this.formComponent.documentForm.getRawValue()).pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        this.snackBar.open('Успешно!', '', {duration: 3000});
      });
  }
}

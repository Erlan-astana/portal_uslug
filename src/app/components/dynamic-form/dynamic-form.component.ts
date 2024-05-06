import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import QuestionBase = dic.QuestionBase;
import {dic} from '../../shared/models/dictionary.model';
import {AdminService} from '../../services/admin.service';

@Component({
  selector: 'app-dinamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
})
export class DynamicFormComponent implements OnInit {
  @Input() formData: any;
  @Input() formFields: any;
  documentForm: FormGroup;
  formGroupFields = [];

  constructor(
    private adminService: AdminService
  ) {
  }

  ngOnInit() {
    this.initForm();
    this.setForm();
  }

  private initForm() {
    this.formFields.forEach(item => {
      this.formGroupFields.push(new QuestionBase({
        key: item.key, type: item.type,
        required: item.required, controlType: item.controlType, disabled: !item.disabled,
        valids: item.validators || []
      }));
    });
    this.documentForm = this.toFormGroup();
  }

  setForm() {
    if (this.formData) {
      this.adminService.setForm(this.documentForm.controls, this.formData);
    }
  }

  toFormGroup() {
    const group: any = {};

    this.formGroupFields.forEach(question => {
      group[question.key] = new FormControl({value: question.value || '', disabled: question.disabled});
      if (question.valids.length > 0) {
        group[question.key].setValidators(question.valids);
      }
    });
    return new FormGroup(group);
  }

  public checkEventValueType(evt: any, key) {
    if (key === 'iin') {
      if (evt.which !== 8 && isNaN(Number(String.fromCharCode(evt.which)))) {
        evt.preventDefault();
      }
      if (evt.target.value.length > 11) {
        evt.preventDefault();
      }
    }
  }

}

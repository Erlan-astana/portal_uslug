import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import {SelectSuberviceModule} from '../select-subservice/select-subervice.module';
import {DynamicFormComponent} from './dynamic-form.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    SelectSuberviceModule,
    ReactiveFormsModule
  ],
  exports: [
    DynamicFormComponent
  ],
  declarations: [
    DynamicFormComponent
  ]
})
export class DynamicFormModule { }

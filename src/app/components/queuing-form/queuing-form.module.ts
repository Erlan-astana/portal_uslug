import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import {QueuingFormComponent} from './queuing-form.component';
import {DynamicFormModule} from '../dynamic-form/dynamic-form.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    DynamicFormModule
  ],
  exports: [
    QueuingFormComponent
  ],
  declarations: [
    QueuingFormComponent
  ]
})
export class QueuingFormModule { }

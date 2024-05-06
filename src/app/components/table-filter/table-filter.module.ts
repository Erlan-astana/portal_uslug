import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import {TableFilterComponent} from './table-filter.component';
import {SelectSuberviceModule} from '../select-subservice/select-subervice.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    SelectSuberviceModule
  ],
  exports: [
    TableFilterComponent
  ],
  declarations: [
    TableFilterComponent
  ]
})
export class TableFilterModule { }

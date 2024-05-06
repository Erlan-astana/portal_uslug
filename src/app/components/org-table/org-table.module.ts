import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import {SelectSuberviceModule} from '../select-subservice/select-subervice.module';
import {OrgTableComponent} from './org-table.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    SelectSuberviceModule
  ],
  exports: [
    OrgTableComponent
  ],
  declarations: [
    OrgTableComponent
  ]
})
export class OrgTableModule { }

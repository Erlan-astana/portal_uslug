import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {SharedModule} from '../../../shared/shared.module';
import {ApprovalSheetComponent} from './approval-sheet.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule
  ],
  exports: [
    ApprovalSheetComponent
  ],
  declarations: [
    ApprovalSheetComponent
  ]
})
export class ApprovalSheetModule { }

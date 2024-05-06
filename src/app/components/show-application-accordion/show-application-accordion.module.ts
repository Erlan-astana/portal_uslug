import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import {ShowApplicationAccordionComponent} from './show-application-accordion.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule
  ],
  exports: [
    ShowApplicationAccordionComponent
  ],
  declarations: [
    ShowApplicationAccordionComponent
  ]
})
export class ShowApplicationAccordionModule { }

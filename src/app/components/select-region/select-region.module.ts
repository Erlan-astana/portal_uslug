import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';


import {FormsModule} from '@angular/forms';
import {MaterialModule} from '../../shared/modules/material.module';
import {SelectRegionComponent} from './select-region.component';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule
  ],
  declarations: [SelectRegionComponent],
  exports: [SelectRegionComponent],

})
export class SelectRegionModule {
}

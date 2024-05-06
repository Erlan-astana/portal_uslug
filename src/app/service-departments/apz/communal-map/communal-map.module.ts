import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import {CommunalMapComponent} from './communal-map.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule
  ],
  exports: [
    CommunalMapComponent
  ],
  declarations: [
    CommunalMapComponent
  ]
})
export class CommunalMapModule { }

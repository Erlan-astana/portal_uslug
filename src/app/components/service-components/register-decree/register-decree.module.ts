import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {SharedModule} from '../../../shared/shared.module';
import {RegisterDecreeComponent} from './register-decree.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule
  ],
  exports: [
    RegisterDecreeComponent
  ],
  declarations: [
    RegisterDecreeComponent
  ]
})
export class RegisterDecreeModule { }

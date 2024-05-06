import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {SharedModule} from '../../../shared/shared.module';
import {ResolutionTextComponent} from './resolution-text.component';
import {EditorModule} from '../../editor/editor.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    EditorModule
  ],
  exports: [
    ResolutionTextComponent
  ],
  declarations: [
    ResolutionTextComponent
  ]
})
export class ResolutionTextModule { }

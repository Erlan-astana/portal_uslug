import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import {EditorComponent} from './editor.component';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    CKEditorModule,

  ],
  exports: [
    EditorComponent
  ],
  declarations: [
    EditorComponent
  ]
})
export class EditorModule { }

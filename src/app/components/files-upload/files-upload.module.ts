import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import {FilesUploadComponent} from './files-upload.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule
  ],
  exports: [
    FilesUploadComponent
  ],
  declarations: [
    FilesUploadComponent
  ]
})
export class FilesUploadModule { }

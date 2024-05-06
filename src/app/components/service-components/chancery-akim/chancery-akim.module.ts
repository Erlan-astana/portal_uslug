import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {ChanceryAkimComponent} from './chancery-akim.component';
import {SharedModule} from '../../../shared/shared.module';
import {FilesUploadModule} from "../../files-upload/files-upload.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    FilesUploadModule
  ],
  exports: [
    ChanceryAkimComponent
  ],
  declarations: [
    ChanceryAkimComponent
  ]
})
export class ChanceryAkimModule { }

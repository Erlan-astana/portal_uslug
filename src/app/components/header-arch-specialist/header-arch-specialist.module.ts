import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';

import {HeaderArchSpecialistComponent} from './header-arch-specialist.component';
import {FilesUploadModule} from '../files-upload/files-upload.module';
import {TaskHistoryComponent} from './task-history/task-history.component';
import {AisgzkComponent} from '../aisgzk/aisgzk.component';
import {SearchGbdComponent} from './search-gbd/search-gbd.component';
import {SearchGbdService} from './search-gbd/search-gbd.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    FilesUploadModule
  ],
  exports: [
    HeaderArchSpecialistComponent
  ],
  declarations: [
    HeaderArchSpecialistComponent,
    TaskHistoryComponent,
    AisgzkComponent,
    SearchGbdComponent
  ],
  entryComponents: [
    TaskHistoryComponent,
    AisgzkComponent,
    SearchGbdComponent
  ],
  providers: [
    SearchGbdService
  ]
})
export class HeaderArchSpecialistModule {
}

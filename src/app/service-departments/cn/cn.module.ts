import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';


import {ArchMapModule} from '../../components/arch-map/arch-map.module';
import {FilesUploadModule} from '../../components/files-upload/files-upload.module';
import {HeaderArchSpecialistModule} from '../../components/header-arch-specialist/header-arch-specialist.module';
import {ShowApplicationAccordionModule} from '../../components/show-application-accordion/show-application-accordion.module';

import {EditorModule} from '../../components/editor/editor.module';
import {DateAdapter, MAT_DATE_LOCALE} from '@angular/material';
import {AppDateAdapter} from 'src/app/shared/helper/format-datepicker';
import {CnStudyComponent} from './cn-study/cn-study.component';
import {CnHeaderComponent} from './cn-header/cn-header.component';
import {CnRoutingModule} from './cn-routing.module';
import {ResolutionTextModule} from '../../components/service-components/resolution-text/resolution-text.module';
import {ApprovalSheetModule} from '../../components/service-components/approval-sheet/approval-sheet.module';
import {ChanceryAkimModule} from '../../components/service-components/chancery-akim/chancery-akim.module';
import {OzoHistoryComponent} from './ozo-history/ozo-history.component';

@NgModule({
  imports: [
    CommonModule,
    CnRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ArchMapModule,
    HeaderArchSpecialistModule,
    FilesUploadModule,
    ShowApplicationAccordionModule,
    EditorModule,
    ResolutionTextModule,
    ApprovalSheetModule,
    ChanceryAkimModule
  ],
  entryComponents: [],
  declarations: [
    CnStudyComponent,
    CnHeaderComponent,
    OzoHistoryComponent
  ],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_LOCALE, useValue: 'ru-RU'},
  ]
})
export class CnModule {
}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';


import {ArchMapModule} from '../../components/arch-map/arch-map.module';
import {FilesUploadModule} from '../../components/files-upload/files-upload.module';
import {HeaderArchSpecialistModule} from '../../components/header-arch-specialist/header-arch-specialist.module';
import {ShowApplicationAccordionModule} from '../../components/show-application-accordion/show-application-accordion.module';
import {ShortServiceRoutingModule} from './short-service-routing.module';
import {ShortServiceStudyComponent} from './short-service-study/short-service-study.component';
import {EditorModule} from '../../components/editor/editor.module';
import {ShortServiceHeaderComponent} from './short-service-header/short-service-header.component';
import {DateAdapter, MAT_DATE_LOCALE} from '@angular/material';
import {AppDateAdapter} from 'src/app/shared/helper/format-datepicker';
import {RegisterDecreeModule} from "../../components/service-components/register-decree/register-decree.module";

@NgModule({
  imports: [
    CommonModule,
    ShortServiceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ArchMapModule,
    HeaderArchSpecialistModule,
    FilesUploadModule,
    ShowApplicationAccordionModule,
    EditorModule,
    RegisterDecreeModule
  ],
  entryComponents: [],
  declarations: [
    ShortServiceStudyComponent,
    ShortServiceHeaderComponent
  ],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_LOCALE, useValue: 'ru-RU'},
  ]
})
export class ShortServiceModule {
}

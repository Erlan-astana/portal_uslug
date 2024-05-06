import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';


import {ArchMapModule} from '../../components/arch-map/arch-map.module';
import {FilesUploadModule} from '../../components/files-upload/files-upload.module';
import {SketchRoutingModule} from './sketch-routing.module';
import {HeaderArchSpecialistModule} from '../../components/header-arch-specialist/header-arch-specialist.module';
import {ShowApplicationAccordionModule} from '../../components/show-application-accordion/show-application-accordion.module';
import {SketchStudyComponent} from './sketch-study/sketch-study.component';
import {SketchHeaderComponent} from './sketch-header/sketch-header.component';
import {SketchViewCardComponent} from './sketch-view-card/sketch-view-card.component';
import {EditorModule} from '../../components/editor/editor.module';
import {DateAdapter, MAT_DATE_LOCALE} from '@angular/material';
import {AppDateAdapter} from '../../shared/helper/format-datepicker';
import {QueuingFormModule} from "../../components/queuing-form/queuing-form.module";

@NgModule({
  imports: [
    CommonModule,
    SketchRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ArchMapModule,
    HeaderArchSpecialistModule,
    FilesUploadModule,
    ShowApplicationAccordionModule,
    EditorModule,
    QueuingFormModule
  ],
  entryComponents: [],
  declarations: [
    SketchStudyComponent,
    SketchHeaderComponent,
    SketchViewCardComponent,
  ],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_LOCALE, useValue: 'ru-RU'},
  ]
})
export class SketchModule {
}

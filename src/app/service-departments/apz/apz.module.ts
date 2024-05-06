import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';


import {ArchMapModule} from '../../components/arch-map/arch-map.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {MatSortModule} from '@angular/material/sort';

import {FilesUploadModule} from '../../components/files-upload/files-upload.module';
import {ApzRoutingModule} from './apz-routing.module';
import {HeaderArchSpecialistModule} from '../../components/header-arch-specialist/header-arch-specialist.module';
import {ShowApplicationAccordionModule} from '../../components/show-application-accordion/show-application-accordion.module';
import {ApzHeaderComponent} from './apz-header/apz-header.component';
import {ApzStudyComponent} from './apz-study/apz-study.component';
import {EditorModule} from '../../components/editor/editor.module';
import {CommunalStudyComponent} from './communal-study/communal-study.component';
import {CommunalHeaderComponent} from './communal-header/communal-header.component';
import {CommunalMapModule} from './communal-map/communal-map.module';
import {IdentifyService} from '../../services/identify.service';
import {OrgTableModule} from '../../components/org-table/org-table.module';

@NgModule({
  imports: [
    CommonModule,
    ApzRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ArchMapModule,
    NgxPaginationModule,
    MatSortModule,
    HeaderArchSpecialistModule,
    FilesUploadModule,
    ShowApplicationAccordionModule,
    EditorModule,
    CommunalMapModule,
    OrgTableModule
  ],
  entryComponents: [
  ],
  declarations: [
    ApzHeaderComponent,
    ApzStudyComponent,
    CommunalStudyComponent,
    CommunalHeaderComponent,
  ],
  providers: [
    IdentifyService
  ]
})
export class ApzModule {
}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';


import {ArchMapModule} from '../../components/arch-map/arch-map.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {MatSortModule} from '@angular/material/sort';

import {FilesUploadModule} from '../../components/files-upload/files-upload.module';

import {HeaderArchSpecialistModule} from '../../components/header-arch-specialist/header-arch-specialist.module';
import {ShowApplicationAccordionModule} from '../../components/show-application-accordion/show-application-accordion.module';
import {EditorModule} from '../../components/editor/editor.module';
import {OrgTableModule} from '../../components/org-table/org-table.module';
import {OwnershipHeaderComponent} from './ownership-header/ownership-header.component';
import {OwnershipStudyComponent} from './ownership-study/ownership-study.component';
import {OwnershipRoutingModule} from './ownership-routing.module';
import {RegisterDecreeModule} from '../../components/service-components/register-decree/register-decree.module';


@NgModule({
  imports: [
    CommonModule,
    OwnershipRoutingModule,
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
    OrgTableModule,
    RegisterDecreeModule
  ],
  entryComponents: [
  ],
  declarations: [
    OwnershipHeaderComponent,
    OwnershipStudyComponent
  ],
})
export class OwnershipModule {
}

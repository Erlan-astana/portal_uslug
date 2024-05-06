import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';


import {ArchMapModule} from '../../components/arch-map/arch-map.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {MatSortModule} from '@angular/material/sort';
import {DirectoryRoutingModule} from './directory-routing.module';
import {CorrespondencesComponent} from './correspondences/correspondences.component';
import {CorrespondenceFormComponent} from './correspondence-form/correspondence-form.component';
import {AdmDocumentsComponent} from './adm-documents/adm-documents.component';
import {AdmDocumentsFormComponent} from './adm-documents-form/adm-documents-form.component';
import {FilesUploadModule} from '../../components/files-upload/files-upload.module';
import {EditorModule} from '../../components/editor/editor.module';
import {TableFilterModule} from '../../components/table-filter/table-filter.module';
import {MonitoringContractComponent} from './monitoring-contract/monitoring-contract.component';
import {DynamicFormModule} from '../../components/dynamic-form/dynamic-form.module';
import {LandMonitoringComponent} from './land-monitoring/land-monitoring.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ArchMapModule,
    NgxPaginationModule,
    DirectoryRoutingModule,
    MatSortModule,
    FilesUploadModule,
    EditorModule,
    TableFilterModule,
    DynamicFormModule
  ],
  declarations: [
    CorrespondencesComponent,
    CorrespondenceFormComponent,
    AdmDocumentsComponent,
    AdmDocumentsFormComponent,
    MonitoringContractComponent,
    LandMonitoringComponent
  ],
})
export class DirectoryModule {
}

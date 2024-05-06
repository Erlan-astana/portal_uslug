import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import {ArchitectureRoutingModule} from './architecture-routing.module';
import {ExternalFulfilledTasksComponent} from './external-&-fulfilled-tasks/external-&-fulfilled-tasks.component';
import {ApplicationCardComponent} from './application-card/application-card.component';
import {ArchMapModule} from '../../components/arch-map/arch-map.module';
import {MyTasksComponent} from './my-tasks/my-tasks.component';
import {ShowApplicationAccordionModule} from '../../components/show-application-accordion/show-application-accordion.module';
import {HeaderArchSpecialistModule} from '../../components/header-arch-specialist/header-arch-specialist.module';
import {BaseSpecialistComponent} from './base-specialist/base-specialist.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {MatSortModule} from '@angular/material/sort';
import {FilesUploadModule} from '../../components/files-upload/files-upload.module';
import {TableFilterModule} from '../../components/table-filter/table-filter.module';
import {MyReportsComponent} from './my-reports/my-reports.component';
import {ReassingTaskComponent} from './my-tasks/reassing-task/reassing-task.component';

@NgModule({
  imports: [
    CommonModule,
    ArchitectureRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ArchMapModule,
    ShowApplicationAccordionModule,
    HeaderArchSpecialistModule,
    NgxPaginationModule,
    MatSortModule,
    FilesUploadModule,
    TableFilterModule
  ],
  entryComponents: [
    MyTasksComponent,
    ReassingTaskComponent
  ],
  declarations: [
    ExternalFulfilledTasksComponent,
    ApplicationCardComponent,
    MyTasksComponent,
    BaseSpecialistComponent,
    MyReportsComponent,
    ReassingTaskComponent
  ],
})
export class ArchitectureModule { }

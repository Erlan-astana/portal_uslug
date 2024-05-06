import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';

import {NgxPaginationModule} from 'ngx-pagination';
import {TemplateEditorComponent} from './template-editor/template-editor.component';
import {AdminRoutingModule} from './admin-routing.module';
import {StatisticsComponent} from './statistics/statistics.component';
import {SelectSuberviceModule} from '../../components/select-subservice/select-subervice.module';
import {DateAdapter, MAT_DATE_LOCALE} from '@angular/material';
import {RolesComponent} from './roles/roles.component';
import {RolesFormComponent} from './roles-form/roles-form.component';
import {UsersComponent} from './users/users.component';
import {UsersFormComponent} from './users-form/users-form.component';
import {UserRoleFormComponent} from './user-role-form/user-role-form.component';
import {ServicesComponent} from './services/services.component';
import {ServiceExecutorsComponent} from './service-executors/service-executors.component';
import {ServiceFormComponent} from './service-form/service-form.component';
import {RoleServicesComponent} from './role-services/role-services.component';
import {AccessSidenavComponent} from './access-sidenav/access-sidenav.component';
import {SubjectTemplateEditorComponent} from './subject-template-editor/subject-template-editor.component';
import {EditorModule} from '../../components/editor/editor.module';
import {SelectRegionModule} from '../../components/select-region/select-region.module';
import {AppDateAdapter} from '../../shared/helper/format-datepicker';
import { ServiceStatisticsComponent } from './service-statistics/service-statistics.component';
import {ReportsComponent} from './reports/reports.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    SharedModule,
    NgxPaginationModule,
    SelectSuberviceModule,
    EditorModule,
    SelectRegionModule
  ],
  entryComponents: [
    UserRoleFormComponent
  ],
  declarations: [
    TemplateEditorComponent,
    StatisticsComponent,
    RolesComponent,
    RolesFormComponent,
    RoleServicesComponent,
    UsersComponent,
    UsersFormComponent,
    UserRoleFormComponent,
    ServicesComponent,
    ServiceExecutorsComponent,
    ServiceFormComponent,
    AccessSidenavComponent,
    SubjectTemplateEditorComponent,
    ServiceStatisticsComponent,
    ReportsComponent
  ],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_LOCALE, useValue: 'ru-RU'},
  ]
})
export class AdminModule {
}

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ROLES} from '../../shared/utils/constants';
import {TemplateEditorComponent} from './template-editor/template-editor.component';
import {StatisticsComponent} from './statistics/statistics.component';
import {RolesComponent} from './roles/roles.component';
import {RolesFormComponent} from './roles-form/roles-form.component';
import {UsersComponent} from './users/users.component';
import {UsersFormComponent} from './users-form/users-form.component';
import {ServicesComponent} from './services/services.component';
import {ServiceExecutorsComponent} from './service-executors/service-executors.component';
import {ServiceFormComponent} from './service-form/service-form.component';
import {RoleGuard} from '../../shared/helper/role.guard';
import {RoleServicesComponent} from './role-services/role-services.component';
import {AccessSidenavComponent} from './access-sidenav/access-sidenav.component';
import {SubjectTemplateEditorComponent} from './subject-template-editor/subject-template-editor.component';
import {ServiceStatisticsComponent} from './service-statistics/service-statistics.component';
import {ReportsComponent} from './reports/reports.component';


const routes: Routes = [
  {
    path: 'templateEditor', component: TemplateEditorComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard], data: {roles: [ROLES.ADMIN]}
  },
  {
    path: 'subjectTemplateEditor', component: SubjectTemplateEditorComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard]
  },
  {
    path: 'statistic', component: StatisticsComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard]
  },
  {
    path: 'reports', component: ReportsComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard]
  },
  {
    path: 'serviceStatistics', component: ServiceStatisticsComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard]
  },
  {
    path: 'roles', component: RolesComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard], data: {roles: [ROLES.ADMIN]}
  },
  {
    path: 'roles/add', component: RolesFormComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard], data: {roles: [ROLES.ADMIN]}
  },
  {
    path: 'roles/subservices', component: RoleServicesComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard], data: {roles: [ROLES.ADMIN]}
  },
  {
    path: 'users', component: UsersComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard], data: {roles: [ROLES.ADMIN]}
  },
  {
    path: 'users/add', component: UsersFormComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard], data: {roles: [ROLES.ADMIN]}
  },
  {
    path: 'users/edit', component: UsersFormComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard], data: {roles: [ROLES.ADMIN]}
  },
  {
    path: 'users/access', component: AccessSidenavComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard], data: {roles: [ROLES.ADMIN]}
  },
  {
    path: 'services', component: ServicesComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard], data: {roles: [ROLES.ADMIN]}
  },
  {
    path: 'services/executors', component: ServiceExecutorsComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard], data: {roles: [ROLES.ADMIN]}
  },
  {
    path: 'services/edit', component: ServiceFormComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard], data: {roles: [ROLES.ADMIN]}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}

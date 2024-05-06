import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ExternalFulfilledTasksComponent} from './external-&-fulfilled-tasks/external-&-fulfilled-tasks.component';
import {ApplicationCardComponent} from './application-card/application-card.component';
import {MyTasksComponent} from './my-tasks/my-tasks.component';
import {BaseSpecialistComponent} from './base-specialist/base-specialist.component';
import {MyReportsComponent} from './my-reports/my-reports.component';
import {RoleGuard} from '../../shared/helper/role.guard';


const routes: Routes = [
  {
    path: 'incoming', component: ExternalFulfilledTasksComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard]
  },
  {
    path: 'app',
    component: ApplicationCardComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard]
  },
  {
    path: 'currentTasks',
    component: MyTasksComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard]
  },
  {
    path: 'form/letter',
    component: BaseSpecialistComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard]
  },
  {
    path: 'external',
    component: MyTasksComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard]
  },
  {
    path: 'outcoming',
    component: ExternalFulfilledTasksComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard]
  },
  {
    path: 'revoked',
    component: MyTasksComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard]
  },
  {
    path: 'control',
    component: ExternalFulfilledTasksComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard]
  },
  {
    path: 'allTasks',
    component: MyTasksComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard]
  },
  {
    path: 'appOperations',
    component: MyTasksComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard]
  },
  {
    path: 'left',
    component: MyTasksComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard]
  },
  {
    path: 'finishedTasks',
    component: MyTasksComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard]
  },
  {
    path: 'executorReport', component: MyReportsComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard]
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArchitectureRoutingModule {
}

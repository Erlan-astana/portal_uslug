import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CnStudyComponent} from './cn-study/cn-study.component';
import {OzoHistoryComponent} from './ozo-history/ozo-history.component';
import {RoleGuard} from '../../shared/helper/role.guard';


const routes: Routes = [
  {
    path: 'study', component: CnStudyComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard]
  },
  {
    path: 'history', component: OzoHistoryComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CnRoutingModule {
}

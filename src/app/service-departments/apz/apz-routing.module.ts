import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ApzStudyComponent} from './apz-study/apz-study.component';
import {CommunalStudyComponent} from './communal-study/communal-study.component';
import {RoleGuard} from '../../shared/helper/role.guard';

const routes: Routes = [
  {
    path: 'study', component: ApzStudyComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard]
  },
  {
    path: 'communal-study', component: CommunalStudyComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard]
  }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApzRoutingModule {
}

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ShortServiceStudyComponent} from './short-service-study/short-service-study.component';
import {RoleGuard} from '../../shared/helper/role.guard';


const routes: Routes = [
  {
    path: 'study', component: ShortServiceStudyComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShortServiceRoutingModule {
}

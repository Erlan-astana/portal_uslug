import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OwnershipStudyComponent} from './ownership-study/ownership-study.component';
import {RoleGuard} from '../../shared/helper/role.guard';

const routes: Routes = [
  {
    path: 'study', component: OwnershipStudyComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OwnershipRoutingModule {
}

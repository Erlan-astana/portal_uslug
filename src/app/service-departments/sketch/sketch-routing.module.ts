import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SketchStudyComponent} from './sketch-study/sketch-study.component';
import {SketchViewCardComponent} from './sketch-view-card/sketch-view-card.component';
import {RoleGuard} from '../../shared/helper/role.guard';


const routes: Routes = [
  {
    path: 'study', component: SketchStudyComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard]
  },
  {
    path: 'view', component: SketchViewCardComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard]
  }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SketchRoutingModule {
}

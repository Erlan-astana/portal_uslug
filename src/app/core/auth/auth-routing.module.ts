import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserActivateComponent} from './user-activate/user-activate.component';

const routes: Routes = [{
  path: 'activate', component: UserActivateComponent,
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule { }

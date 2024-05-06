import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SpecregComponent} from './specreg.component';
import {SpecregFormComponent} from './specreg-form/specreg-form.component';
import {SpecregHistoryComponent} from './specreg-history/specreg-history.component';
import {SpecregJournalComponent} from './specreg-journal/specreg-journal.component';
import {RoleGuard} from "../../shared/helper/role.guard";


const routes: Routes = [
  {
    path: '', component: SpecregComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard]
  },
  {
    path: 'edit', component: SpecregFormComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard]
  },
  {
    path: 'waiting', component: SpecregComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard]
  },
  {
    path: 'history', component: SpecregHistoryComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard]
  },
  {
    path: 'specregJournal', component: SpecregJournalComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpecregRoutingModule {
}

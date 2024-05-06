import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CorrespondencesComponent} from './correspondences/correspondences.component';
import {CorrespondenceFormComponent} from './correspondence-form/correspondence-form.component';
import {AdmDocumentsComponent} from './adm-documents/adm-documents.component';
import {AdmDocumentsFormComponent} from './adm-documents-form/adm-documents-form.component';
import {MonitoringContractComponent} from './monitoring-contract/monitoring-contract.component';
import {LandMonitoringComponent} from './land-monitoring/land-monitoring.component';
import {RoleGuard} from "../../shared/helper/role.guard";

const routes: Routes = [
  {
    path: 'correspondences/incomingCorrespondences', component: CorrespondencesComponent,
  },
  {
    path: 'correspondences/outcomingCorrespondences', component: CorrespondencesComponent,
  },
  {
    path: 'correspondences/create', component: CorrespondenceFormComponent,
  },
  {
    path: 'correspondences/edit', component: CorrespondenceFormComponent,
  },
  {
    path: 'documents', component: AdmDocumentsComponent
  },
  {
    path: 'document/create', component: AdmDocumentsFormComponent
  },
  {
    path: 'document/edit', component: AdmDocumentsFormComponent
  },
  {
    path: 'monitoringContract', component: MonitoringContractComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard]
  },
  {
    path: 'monitoringZu', component: LandMonitoringComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DirectoryRoutingModule {
}

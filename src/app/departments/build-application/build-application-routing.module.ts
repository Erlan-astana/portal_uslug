import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BuildApplicationComponent} from './build-application/build-application.component';
import {ApplicationFormComponent} from './application-form/application-form.component';
import {ObjectDataFormComponent} from './object-data-form/object-data-form.component';
import {AttachmentDocumentsComponent} from './attachment-documents/attachment-documents.component';
import {SignApplicationComponent} from './sign-application/sign-application.component';
import {ProjectorDataFormComponent} from './projector-data-form/projector-data-form.component';
import {ElectrificationFormComponent} from './electrification-form/electrification-form.component';
import {WaterSupplyFormComponent} from './water-supply-form/water-supply-form.component';
import {SewerageFormComponent} from './sewerage-form/sewerage-form.component';
import {HeatSupplyFormComponent} from './heat-supply-form/heat-supply-form.component';
import {GasSupplyFormComponent} from './gas-supply-form/gas-supply-form.component';
import {LandProjectorFormComponent} from './land-projector-form/land-projector-form.component';

const routes: Routes = [
  {
    path: '', component: BuildApplicationComponent, children: [
      {
        path: 'application', component: ApplicationFormComponent,
      },
      {
        path: 'projector', component: ProjectorDataFormComponent,
      },
      {
        path: 'land-projector', component: LandProjectorFormComponent,
      },
      {
        path: 'object', component: ObjectDataFormComponent,
      },
      {
        path: 'files', component: AttachmentDocumentsComponent,
      },
      {
        path: 'sign', component: SignApplicationComponent,
      },
      {
        path: 'electrification', component: ElectrificationFormComponent,
      },
      {
        path: 'water-supply', component: WaterSupplyFormComponent,
      },
      {
        path: 'sewerage', component: SewerageFormComponent,
      },
      {
        path: 'heat-supply', component: HeatSupplyFormComponent,
      },
      {
        path: 'gas-supply', component: GasSupplyFormComponent,
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuildApplicationRoutingModule {
}

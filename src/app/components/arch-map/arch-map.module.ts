import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';

import {ArchMapComponent} from './arch-map.component';
import {IdentifyService} from '../../services/identify.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule
  ],
  exports: [
    ArchMapComponent
  ],
  declarations: [
    ArchMapComponent
  ],
  providers: [
    IdentifyService
  ]
})
export class ArchMapModule {
}

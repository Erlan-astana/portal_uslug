import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {SelectSuberviceComponent} from './select-subervice.component';

import {FormsModule} from '@angular/forms';
import {MaterialModule} from '../../shared/modules/material.module';
import {MAT_DATE_LOCALE} from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    TranslateModule
  ],
  declarations: [SelectSuberviceComponent],
  exports: [SelectSuberviceComponent],
  providers: [
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' }
  ]
})
export class SelectSuberviceModule {
}

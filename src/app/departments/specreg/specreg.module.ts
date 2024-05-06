import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {MatSortModule} from '@angular/material';
import {DynamicFormModule} from '../../components/dynamic-form/dynamic-form.module';
import {SpecregCommisionComponentComponent} from './specreg-commision-component/specreg-commision-component.component';
import {TableFilterModule} from '../../components/table-filter/table-filter.module';
import {FilesUploadModule} from '../../components/files-upload/files-upload.module';
import {RenumerateComponent} from './renumerate/renumerate.component';
import {SpecregComponent} from './specreg.component';
import {SpecregFormComponent} from './specreg-form/specreg-form.component';
import {SpecregHistoryComponent} from './specreg-history/specreg-history.component';
import {SpecregRoutingModule} from './specreg-routing.module';
import {SpecregJournalComponent} from './specreg-journal/specreg-journal.component';
import {SpecregExcludeComponent} from './specreg-exclude/specreg-exclude.component';
import {SelectRegionModule} from '../../components/select-region/select-region.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule,
    MatSortModule,
    FilesUploadModule,
    TableFilterModule,
    DynamicFormModule,
    SpecregRoutingModule,
    SelectRegionModule
  ],
  entryComponents: [
    SpecregCommisionComponentComponent,
    RenumerateComponent,
    SpecregComponent,
    SpecregExcludeComponent],
  declarations: [
    SpecregComponent,
    SpecregFormComponent,
    SpecregCommisionComponentComponent,
    SpecregHistoryComponent,
    RenumerateComponent,
    SpecregJournalComponent,
    SpecregExcludeComponent
  ],
})
export class SpecregModule {
}

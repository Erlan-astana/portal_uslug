import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { EditorModule } from '../../components/editor/editor.module';
import { ArchMapModule } from '../../components/arch-map/arch-map.module';
import { FilesUploadModule } from '../../components/files-upload/files-upload.module';
import { HeaderArchSpecialistModule } from '../../components/header-arch-specialist/header-arch-specialist.module';
import { ShowApplicationAccordionModule } from 'src/app/components/show-application-accordion/show-application-accordion.module';

import { BezTorgRegHeaderComponent } from './bez-torg-reg-header/bez-torg-reg-header.component';
import { BezTorgRegStudyComponent } from './bez-torg-reg-study/bez-torg-reg-study.component';
import { ListParallelModule } from 'src/app/components/service-components/list-parallel/list-parallel.module';
import { ApprovalSheetModule } from 'src/app/components/service-components/approval-sheet/approval-sheet.module';
import { AuctionDataFormComponent } from './auction-data-form/auction-data-form.component';
import { DetermineDivisibilityComponent } from './determine-divisibility.component';

const routes: Routes = [
  { path: 'study', component: BezTorgRegStudyComponent }
];

@NgModule({
  declarations: [BezTorgRegHeaderComponent, BezTorgRegStudyComponent, AuctionDataFormComponent,
   DetermineDivisibilityComponent],
  entryComponents : [AuctionDataFormComponent, DetermineDivisibilityComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    EditorModule,
    ArchMapModule,
    FilesUploadModule,
    HeaderArchSpecialistModule,
    ShowApplicationAccordionModule,
    ListParallelModule,
    ApprovalSheetModule
  ]
})
export class BezTorgRegModule { }

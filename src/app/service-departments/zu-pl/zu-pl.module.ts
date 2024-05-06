import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { EditorModule } from '../../components/editor/editor.module';
import { ArchMapModule } from '../../components/arch-map/arch-map.module';
import { FilesUploadModule } from '../../components/files-upload/files-upload.module';
import { HeaderArchSpecialistModule } from '../../components/header-arch-specialist/header-arch-specialist.module';
import { ShowApplicationAccordionModule } from 'src/app/components/show-application-accordion/show-application-accordion.module';

import { ListParallelModule } from 'src/app/components/service-components/list-parallel/list-parallel.module';
import { ZuPlHeaderComponent } from './zu-pl-header/zu-pl-header.component';
import { ZuPlStudyComponent } from './zu-pl-study/zu-pl-study.component';

const routes: Routes = [
  { path: 'study', component: ZuPlStudyComponent }
];

@NgModule({
  declarations: [ZuPlHeaderComponent, ZuPlStudyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    SharedModule,
    EditorModule,
    ArchMapModule,
    FilesUploadModule,
    HeaderArchSpecialistModule,
    ShowApplicationAccordionModule,
    ListParallelModule
  ]
})
export class ZuPlModule { }


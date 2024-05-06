import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListParallelComponent } from './list-parallel.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [ListParallelComponent],
  entryComponents: [ListParallelComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule
  ]
})
export class ListParallelModule { }

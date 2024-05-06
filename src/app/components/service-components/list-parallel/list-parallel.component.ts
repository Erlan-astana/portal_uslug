import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProblemService } from 'src/app/services/problem.service';
import { dic } from 'src/app/shared/models/dictionary.model';

@Component({
  selector: 'app-list-parallel',
  templateUrl: './list-parallel.component.html',
  styleUrls: ['./list-parallel.component.scss']
})
export class ListParallelComponent {
  dataTaskDecide: dic.Decide = new dic.Decide();

  constructor(
    public dialogRef: MatDialogRef<ListParallelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public taskService: ProblemService,
  ) {
    this.dataTaskDecide = data.dataTaskDecide;
  }

  save() {
    this.taskService.sendTaskDecideSubject(this.dataTaskDecide);
    this.dialogRef.close({});
   }

  close() { this.dialogRef.close(); }

}

import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-electricinfo-category-description',
  templateUrl: './electricinfo-category-description.component.html',
  styleUrls: ['./electricinfo-category-description.component.css']
})
export class ElectricinfoCategoryDescriptionComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ElectricinfoCategoryDescriptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() { }

  close() {
    this.dialogRef.close();
  }

}

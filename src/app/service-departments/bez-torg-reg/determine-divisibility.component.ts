import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-determine-divisibility',
    template: `
    <div class="dialog_container">
        <h2>Делимость земельного участка</h2>
        <div fxLayout="column" fxLayoutAlign="space-between stretch">
            <mat-checkbox fxFlexOffset="15px" [disabled]="noDivisible" [(ngModel)]="divisible">{{'Divisible' | translate}} </mat-checkbox>
            <mat-checkbox fxFlexOffset="15px" [disabled]="divisible" [(ngModel)]="noDivisible">{{'noDivisible' | translate}} </mat-checkbox>
            <button mat-raised-button color="primary" fxFlexOffset="15px" (click)="save()">
                {{'Save' | translate}}
            </button>
            <button mat-raised-button color="primary" fxFlexOffset="15px" (click)="close()">
                {{'Cancel' | translate}}
            </button>
        </div>
    </div>
  `,
    styles: [`
    .dialog_container {
        width: 400px;
        height: 250px;
      }
  `]
})
export class DetermineDivisibilityComponent {

    divisible; noDivisible;
    constructor(
        public dialogRef: MatDialogRef<DetermineDivisibilityComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    close() { this.dialogRef.close(); }

    save() {
        const value = this.divisible ? 'divisible' : 'noDivisible';
        this.dialogRef.close(value);
    }
}

import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-instruction-site-designation',
  templateUrl: './instruction-site-designation.component.html',
  styleUrls: ['./instruction-site-designation.component.scss']
})
export class InstructionSiteDesignationComponent implements OnInit {
  currentLang: string;
  destroyed$ = new Subject();
  constructor(
    public dialogRef: MatDialogRef<InstructionSiteDesignationComponent>,
    public translate: TranslateService
  ) {}

  ngOnInit() {
    this.currentLang = this.translate.currentLang ? this.translate.currentLang : this.translate.getDefaultLang();
    this.translate.onLangChange.pipe(takeUntil(this.destroyed$))
    .subscribe((event: any) => {
      this.currentLang = event.lang;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

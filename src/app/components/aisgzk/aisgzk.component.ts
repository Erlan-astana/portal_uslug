import {Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import * as L from 'leaflet';
import {MapService} from '../../services/map.service';
import {MAT_DIALOG_DATA, MatCardContent, MatDialogRef} from '@angular/material';
import {FileService} from '../../services/file.service';
import {ApiService} from '../../services/api.service';
import {ApplicationService} from '../../services/application.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-aisgzk',
  templateUrl: './aisgzk.component.html',
  styleUrls: ['./aisgzk.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AisgzkComponent implements OnInit, OnDestroy {
  cadastralNumber: any = '';
  gzkAttrsInfo: any = null;
  spinner: boolean = false;
  @ViewChild('gzkContent', {static: false})
  private gzkContent: ElementRef;
  appId: number = null;
  errorMessage: any = null;
  destroyed$ = new Subject();
  constructor(
    private mapSvc: MapService,
    public dialogRef: MatDialogRef<AisgzkComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fileSvc: FileService,
    private api: ApiService,
    private appSvc: ApplicationService
  ) {

  }

  ngOnInit() {
    this.appId = this.appSvc.getApp().id;
    this.cadastralNumber = this.appSvc.getApp().objectInfo.cadastreNumber;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  checkCadNumberLength(evt: any) {
    if (evt.which !== 8 && isNaN(Number(String.fromCharCode(evt.which)))) {
      evt.preventDefault();
    }
  }

  searchByCadastreNumber() {
    if (this.cadastralNumber.length > 9) {
      this.spinner = true;
      this.errorMessage = null;
      this.mapSvc.getIntegrSubject(this.cadastralNumber).pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        this.gzkAttrsInfo = res;
      }, err => {
        this.spinner = false;
        this.errorMessage = 'Нет данных!';
      });
    }
  }

  generatePdfWithGzkInfo() {
    if (this.gzkContent.nativeElement) {
      const body: any = {};
      body.message = `<h3>{{'NumberKadastr' | translate}}: ${this.cadastralNumber}</h3> <br>` + this.gzkContent.nativeElement.innerHTML;
      this.api.postArrayBuffer(`templates/preview`, body).pipe(takeUntil(this.destroyed$))
      .subscribe((res: any) => {
        this.downloadToApplication(res);
      });
    }
  }


  public downloadToApplication(res) {
    const url = `userapp/${this.appId}/files`;
    const file = new File([res], `aisgzk-${new Date().getTime()}.pdf`, {lastModified: new Date().getTime(), type: res.type});

    this.fileSvc.getAddFileSingleReq(file).pipe(takeUntil(this.destroyed$))
      .subscribe((response: any) => {
      const uploadFile = {uid: response.uid, fileName: response.fileName, fileCategory: 'internal', size: res.fileSize};

      this.dialogRef.close({loading: true, file: uploadFile});
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

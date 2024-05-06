import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {DirectoryService} from '../../../services/directory.service';
import {dic} from '../../../shared/models/dictionary.model';
import SpecReg = dic.SpecReg;
import {SpecregStatus} from '../../../shared/utils/constants';

@Component({
  selector: 'app-specreg-history',
  templateUrl: './specreg-history.component.html',
  styleUrls: ['./specreg-history.component.scss']
})
export class SpecregHistoryComponent implements OnInit {
  specregId: any;
  currentLang: any;
  private unsubscribe$ = new Subject<any>();
  specreg: SpecReg = null;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'status'];
  dataSource = [];
  statusList = SpecregStatus;
  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    private directorySvc: DirectoryService,
  ) {
  }

  ngOnInit() {
    this.getQueryParams();
    this.getHistory();
    this.getSpecreg();
  }

  getQueryParams() {
    this.route.queryParams.pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
      this.specregId = params['specregId'];
    });
  }

  initTranslate() {
    this.translate.onLangChange
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((event: any) => {
        this.currentLang = event.lang;
      });
  }

  getSpecreg() {
    if (this.specregId) {
      this.directorySvc.getSpecregById(this.specregId).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
        this.specreg = res;
      });
    }
  }

  getHistory() {
    this.directorySvc.getSpecregHistoryById(this.specregId).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.dataSource = res;
    });
  }

  getStatusStr(text) {
    const status = this.statusList.find(item => text === item.id);
    return status.name;
  }

  goBack() {
    this.directorySvc.goBack();
  }

}

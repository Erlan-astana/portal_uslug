import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../services/api.service';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StatisticsComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  selectedSubservice: any;
  /*startDate: any;
  endDate: any;*/

  overView: any = {
    all: 0,
    registered: 0,
    rejected: 0,
    approved: 0
  };
  subservices: any;
  currentLang;
  destroyed$ = new Subject();
  selectedRegionId: number = null;
  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private translate: TranslateService
  ) {
    this.currentLang = this.translate.currentLang ? this.translate.currentLang : this.translate.getDefaultLang();

  }

  ngOnInit() {
    this.initFormGroup();
    this.getSubServices();
    this.initTranslate();
  }

  initTranslate() {
    this.translate.onLangChange.pipe(takeUntil(this.destroyed$))
      .subscribe((event: any) => {
      this.currentLang = event.lang;
    });
  }

  private initFormGroup() {
    this.searchForm = this.fb.group({
      startDate: [null, Validators.required],
      endDate: [null, Validators.required]
    });
  }

  getSubServices(url = null) {
    this.api.get2(`analytics/stats${url ? url : ''}`).pipe(takeUntil(this.destroyed$))
      .subscribe((data: any) => {
      this.resetData();
      this.subservices = data;
      const allStatisticians = this.subservices.filter(item => {
        return item.id === 0;
      });
      this.setOverView(allStatisticians);
      this.setNumerationInSubservices();
    });
  }

  setNumerationInSubservices() {
    let number = 0;
    this.subservices.forEach(item => {
      if (item.highlight !== null) {
        number = item.highlight === true ? number + 1 : number + 0.1;
        if (!item.highlight) {
          item.number = number.toFixed(1);
        } else {
          item.number = Math.floor(number);
        }
      }
    });
  }

  setOverView(allStatisticians) {
    this.overView = allStatisticians[0];
  }

  resetData() {
    this.overView = {
      all: 0,
      registered: 0,
      rejected: 0,
      approved: 0,
      finished: 0
    };
  }

  getTodayString() {
    return new Date().toLocaleDateString('ru-Ru');
  }

  search() {
    const startDate = this.searchForm.value.startDate ? this.getDateString(this.searchForm.value.startDate) : '1/1/1970';

    const endDate = this.searchForm.value.endDate ? this.getDateString(this.searchForm.value.endDate) : this.getDateString(new Date());

    const subserviceId = this.selectedSubservice ? this.selectedSubservice.id : null;
    let url = `?startDate=${startDate}&endDate=${endDate}`;
    url = subserviceId ? url + `&subserviceId=${subserviceId}` : url;
    url = this.selectedRegionId ? url + `&regionId=${this.selectedRegionId}` : url;
    this.getSubServices(url);
  }

  public getDateString(date: Date) {
    date = new Date(date);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }

  setSelectSubservice(event) {
    this.selectedSubservice = event;
  }

  setSelectedRegionId(id) {
    this.selectedRegionId = id;
  }

  ngOnDestroy(): void {
    //this.subscription.unsubscribe();
  }
}

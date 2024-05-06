import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DicApplicationService} from './services/dic.application.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private translate: TranslateService,
    private dicSvc: DicApplicationService
  ) {
    if (localStorage.getItem('currentLang') === 'kz') {
      translate.setDefaultLang('kz');
    } else {
      translate.setDefaultLang('ru');
    }
  }

  title = 'eatyrau-web';

  ngOnInit() {
    this.dicSvc.getRegions();
  }
}

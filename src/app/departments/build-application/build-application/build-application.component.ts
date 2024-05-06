import {AfterViewInit, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {app} from '../../../shared/models/application.model';
import {ApplicationService} from '../../../services/application.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {Subscription} from 'rxjs';
import {dic} from '../../../shared/models/dictionary.model';
import Subservices = dic.Subservices;
import {AdminService} from '../../../services/admin.service';
import {AuthService} from "../../../services/auth.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-build-application',
  templateUrl: './build-application.component.html',
  styleUrls: ['./build-application.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BuildApplicationComponent implements OnInit, OnDestroy {
  number = 0;
  app: app.App = new app.App();
  subscription: Subscription;
  authSubscription: Subscription;
  subserviceId = null;
  currentLang;
  subservice: Subservices = new Subservices();
  TuSubscription: Subscription;
  stateTu: boolean = true;

  constructor(
    private appSvc: ApplicationService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private adminService: AdminService,
    private authService: AuthService,
    private translate: TranslateService,
  ) {
    this.subscription = this.appSvc.getBuildAppUrl().subscribe(url => {
      this.checkAppUrl(url.data);
    });
    this.authSubscription = this.authService.getcurrentUserSubject().subscribe(user => {
      this.getServiceById();
    });
    this.TuSubscription = this.appSvc.getSubjectTUfile().subscribe(state => {
      this.stateTu = state;
    });
    this.currentLang = this.translate.currentLang ? this.translate.currentLang : this.translate.getDefaultLang();

  }

  ngOnInit() {
    this.getApp();
    this.getQueryParams();
    this.initTranslate();
  }

  getQueryParams() {
    this.route.queryParams.subscribe(params => {
      this.subserviceId = params['subserviceId'];
      this.getServiceById();
    });
  }

  initTranslate() {
    this.translate.onLangChange.subscribe((event: any) => {
      this.currentLang = event.lang;
    });
  }

  getServiceById() {
    if (this.subserviceId && this.authService.currentUser) {
      this.adminService.getServiceById(this.subserviceId).subscribe(res => {
        this.subservice = res;
      });
    }
  }

  checkAppUrl(url) {
    this.setClass(url);
  }

  getApp() {
    this.app = this.appSvc.getApp();
  }

  setClass(num) {
    console.log(this.number)
    this.getApp();
    if (this.app.id) {
      this.number = num;
    }
  }

  changeRoute(url, num) {
    this.app = this.appSvc.getApp();
    if (this.app.id) {
      if (url === '/create-app/files' && !this.app.objectInfo || url === '/create-app/sign' && !this.app.objectInfo) {
        this.showErrorMessage();
      } else {
        this.setClass(num);
        this.router.navigate([url]);
      }
    } else {
      this.setClass(num);
      this.showErrorMessage();
    }
  }

  showErrorMessage() {
    this.snackBar.open('Заполните все поля!', '', {duration: 3000});
  }

  capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  navigationStandardService() {
    const availableServicesId = ['25', '50', '21', '17', '18', '19', '11', '33', '34', '7', '27', '70', '8', '12', '107', '108',
    '130', '131', '132', '134', '77', '135'];
    return availableServicesId.some(id => id === this.subserviceId);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }
}

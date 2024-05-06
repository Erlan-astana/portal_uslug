import {Injectable} from '@angular/core';
import {Location} from '@angular/common';
import {app} from '../shared/models/application.model';
import {ApiService} from '../services/api.service';
import {Observable, Subject} from 'rxjs';
import {
  LINKS_APZ_NAVIGATOR, LINKS_GAS_NAVIGATOR,
  LINKS_IJS_NAVIGATOR,
  LINKS_OZO_NAVIGATOR, LINKS_SPECREG_NAVIGATOR, LINKS_SU_NAVIGATOR, LINKS_TEPLO_NAVIGATOR,
  LINKS_ZEMKOM_NAVIGATOR
} from '../shared/utils/constants';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private app = new app.App();
  public subjectApp = new Subject();
  public buildAppUrl = new Subject();

  public subjectTUfile = new Subject();

  constructor(
    private api: ApiService,
    private location: Location
  ) {
  }

  sendSubjectTuFile(val: any) {
    this.subjectTUfile.next(val);
  }

  getSubjectTUfile(): Observable<any> {
    return this.subjectTUfile.asObservable();
  }

  sendBuildAppUrl(url: any): void {
    this.buildAppUrl.next({data: url});
  }

  clearBuildAppUrl(): void {
    this.buildAppUrl.next();
  }

  getBuildAppUrl(): Observable<any> {
    return this.buildAppUrl.asObservable();
  }

  public getApp() {
    return this.app;
  }

  public setApp(newapp: app.App) {
    this.app = newapp;
  }

  public createApp(appForm, callback?: any) {
    this.api.post2('userapp', appForm).subscribe((data) => {
      if (data.status === 200) {
        if (data.body) {
          this.app = data.body;
          this.subjectApp.next(data.body);
          if (callback) {
            callback(this.app);
          }
        }
      }
    });
  }

  getSubjectApp(): Observable<any> {
    return this.subjectApp.asObservable();
  }

  public getAppReq(id: number, meetingId: number = null) {
    return this.api.get2('userapp/' + id + (meetingId ? '?meetingId=' + meetingId : ''));
  }

  public goBack() {
    this.location.back();
  }

  public updateApp(id, data, callback?) {
    if (id) {
      return this.api.put2(`userapp/${id}`, data).subscribe(res => {
        if (res) {
          this.app = res.body;
          //this.setApp(res.body);
          this.subjectApp.next(res.body);
          if (callback) {
            callback(res.body);
          }
        }
      });
    }
  }

  public getExternalApplications(page: number, size: number, sort: string = null, body = null) {
    return this.api.post2(`userapp/filter?page=${page}&size=${size}&${sort}`, body);
  }

  public generateRegistrationNumber(appId: number, body: any = null) {
    return this.api.post2(`userapp/${appId}/numerate`, body);
  }

  public genRegNumberFileCategory(appId: number, body: any = null, fileCategory: string = 'TEMPORARY_RESULT') {
    return this.api.post2(`userapp/${appId}/numerate?fileCategory=${fileCategory}`, body);
  }

  public generateFinalAct(appId: number, body: any = null) {
    return this.api.post2(`userapp/${appId}/generateFinalAct`, body);
  }

  public generateFinalActMerged(appId: number, body: any = null) {
    return this.api.post2(`userapp/${appId}/generateFinalAct/merged`, body);
  }

  /*public getSentApplications(page: number, size: number, sort: string = null, body) {
    return this.api.post2(`userapp/filter?page=${page}&size=${size}&${sort}`, body);
  }

  public getControlApplications(page: number, size: number, sort: string = null, body) {
    return this.api.post2(`userapp/filter?page=${page}&size=${size}&${sort}`, body);
  }*/

  public getApplicationById(id: number) {
    return this.api.get2(`userapp/${id}`);
  }

  public sendApplication(id: number) {
    return this.api.post2(`userapp/${id}/send`);
  }

  public getAppOrg(appId: number, orgId: number) {
    return this.api.get2(`apporg?organizationId=${orgId}&appId=${appId}`);
  }

  saveAppOrgConnections(appOrgId: number, data) {
    return this.api.post2(`apporg/${appOrgId}/connections`, data);
  }

  getUsersByRole(role: string) {
    return this.api.get(`users?role=${role}`);
  }

  checkingSpecregByIIN(iin: number) {
    return this.api.get2(`specreg/iin/${iin}/check`);
  }

  getNavLink(subserviceId) {
    subserviceId = parseInt(subserviceId);
    if (subserviceId === 2 || subserviceId === 1 || subserviceId === 3 || subserviceId === 4 || subserviceId === 9) {
      return LINKS_APZ_NAVIGATOR;
    }
    const availableServicesId = [25, 50, 21, 17, 18, 19, 11, 33, 34, 70, 27, 7, 8, 12, 107, 108, 130, 131, 132, 134, 77, 135];
    if (availableServicesId.some(id => subserviceId === id)) {
      return LINKS_OZO_NAVIGATOR;
    }
    if (subserviceId === 14) {
      return LINKS_IJS_NAVIGATOR;
    }
    if (subserviceId === 37) {
      return LINKS_SPECREG_NAVIGATOR;
    }
    if (subserviceId === 23) {
      return LINKS_ZEMKOM_NAVIGATOR;
    }
    if (subserviceId === 38) {
      return LINKS_GAS_NAVIGATOR;
    }
    if (subserviceId === 31) {
      return LINKS_SU_NAVIGATOR;
    }
    if (subserviceId === 32) {
      return LINKS_TEPLO_NAVIGATOR;
    }
  }

  getCurrentNavPosition(url, currentNavLinks) {
    if (currentNavLinks) {
      const re = /\?.*$/g;
      const currentUrl = url.replace(re, '');
      return currentNavLinks.indexOf(currentUrl);
    }
  }

  public countdown(date: Date) {
    const milisec_diff = date.getTime() - new Date().getTime();
    const timerData = new app.TimerData();
    const days = Math.floor(milisec_diff / 1000 / 60 / (60 * 24));
    const date_diff = new Date(milisec_diff);
    const day_hours = days * 24;
    const hours = date_diff.getUTCHours() + day_hours;
    if (days || days === 0) {
      timerData.days = days;
    }
    if (hours) {
      timerData.hours = date_diff.getUTCHours();
    }
    timerData.minutes = date_diff.getMinutes();
    timerData.seconds = date_diff.getSeconds();
    if (milisec_diff < 0) {
      timerData.days = 0;
      timerData.hours = 0;
      timerData.minutes = 0;
      timerData.seconds = 0;
    }
    return timerData;
  }
}

import {Injectable, EventEmitter} from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {ApiService} from './api.service';

import {auth} from '../shared/models/auth.model';
import {Observable, Subject} from 'rxjs';
import {ROLES} from '../shared/utils/constants';
import {AdminService} from './admin.service';
import {MessageBoxComponent} from '../components/message-box/message-box.component';
import {MatDialog} from '@angular/material';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  jwtHelper: JwtHelperService;
  currentUser: auth.User = null;
  tokenData: any;
  userInfo$ = new Subject();
  currentOurUser: auth.User = null;
  public currentUserSubject = new Subject();

  constructor(
    private api: ApiService,
    private adminService: AdminService,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.init();
  }

  sendCurrentUserSubject(user: any) {
    this.currentUserSubject.next(user);
  }

  getcurrentUserSubject(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  clearCurrentUserSubject(): void {
    this.currentUserSubject.next();
  }

  init() {
    this.jwtHelper = new JwtHelperService();
    const userSubscription = this.getCurrentUser();
    if (userSubscription) {
      userSubscription.subscribe((data: any) => {
        if (data) {
          this.currentUser = data;
          localStorage.setItem('currentUser', JSON.stringify(data));
          this.userInfo$.next(this.currentUser);
          this.getCurrentOurUser(this.currentUser.username);
        }
      }, error => {
        if (error.status === 401) {
          /*this.logout();
          this.showDialogBox();*/
        }
      });
    } else {
      this.userInfo$.next(this.currentUser);
      if (this.currentUser) {
        this.getCurrentOurUser(this.currentUser.username);
      }
    }
  }

  showDialogBox() {
    let text = '';
    if (this.router.url.includes('/create-app')) {
      text = 'Время сессии вышло. Будет переход на главную страницу';
    } else {
      text = 'Время сессии вышло. Авторизуйтесь повторно.';
    }
    const dialogRef = this.dialog.open(MessageBoxComponent, {
      width: '600px',
      data: {message: text}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (this.router.url.includes('/create-app')) {
        this.redirectToEatyrau();
      } else {
        this.logout();
        this.router.navigate(['/']);
      }
    });
  }

  showErrorDialogBox(text) {
    const dialogRef = this.dialog.open(MessageBoxComponent, {
      width: '600px',
      data: {message: text}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.logout();
    });
  }

  redirectToEatyrau() {
    const url = 'http://eatyrau.kz/';
    window.open(url, '_self');
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  public getTokenData(): any {
    const token = localStorage.getItem('access_token');
    return this.jwtHelper.decodeToken(token);
  }

  public getCurrentUser(): Observable<any> {
    const tokenData = this.getTokenData();
    this.tokenData = tokenData;
    if (tokenData && tokenData.userId) {
      return this.api.get('users/' + tokenData.userId);
    }
    return null;
  }

  getCurrentOurUser(email) {
    this.adminService.getUserByEmail(email).subscribe(res => {
      this.currentOurUser = res;
      this.sendCurrentUserSubject(res);
    });
  }

  public getUser() {
    if (localStorage.currentUser) {
      return JSON.parse(localStorage.currentUser);
    } else {
      return null;
    }

  }

  public hasRole(role: string) {
    if (this.tokenData.authorities) {
      return this.tokenData.authorities.some(e => e === role);
    }
  }

  public hasUserRoleGroup(role: string) {
    if (this.tokenData.authorities) {
      return this.tokenData.authorities.some(e => e.startsWith(role));
    }
  }

  public register(data) {
    return this.api.post_auth('users/register', data, null, false);
  }

  public activateUser(token) {
    return this.api.post_auth(`users/activate?activateToken=${token}`, null, null, false);
  }

  public reactivateUser(email) {
    return this.api.post_auth(`users/reactivate?email=${email}`, null, null, false);
  }

  public logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('currentUser');
    this.userInfo$.next(null);
    this.currentUser = null;
    this.clearCurrentUserSubject();
  }

  getUsersByRole(roleId: number, subserviceId: number) {
    return this.api.get2(`users/roles?roleId=${roleId}&subserviceId=${subserviceId}`);
  }
}

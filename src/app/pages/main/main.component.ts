import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {auth} from '../../shared/models/auth.model';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnInit, OnDestroy {
  currentUser: auth.User = null;
  token: any;
  isAuthenticated: boolean = false;
  destroyed$ = new Subject();

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.getCurrentUser();
    this.getQueryParams();
    this.getCurrentUserState();
  }

  getQueryParams() {
    this.route.queryParams
      .pipe(takeUntil(this.destroyed$))
      .subscribe(params => {
        this.token = params['access_token'];
        this.setAuthUserInOtherProject();
      });
  }

  private getCurrentUserState() {
    this.isAuthenticated = this.authService.isAuthenticated();
  }


  setAuthUserInOtherProject() {
    if (this.token) {
      localStorage.setItem('access_token', this.token);
      this.authService.init();
    }
  }

  getCurrentUser() {
    this.authService.userInfo$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data: any) => {
        if (data) {
          this.currentUser = data;
          this.getCurrentUserState();
        } else {
          this.getCurrentUserState();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}

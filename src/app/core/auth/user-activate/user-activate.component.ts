import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {MessageBoxComponent} from '../../../components/message-box/message-box.component';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-user-activate',
  templateUrl: './user-activate.component.html',
  styleUrls: ['./user-activate.component.scss']
})
export class UserActivateComponent implements OnInit, OnDestroy {
  activateToken: any;
  destroyed$ = new Subject();
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.route.queryParams.pipe(takeUntil(this.destroyed$))
      .subscribe(params => {
      this.activateToken = params['activateToken'];
      this.activateUser();
    });
  }

  activateUser() {
    if (this.activateToken) {
      this.authService.activateUser(this.activateToken).pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        if (res) {
          this.showDialog('Активация прошла ! Вы успешно зарегистрированы !');
          this.changeRoute();
        }
      }, error => {
        this.showDialog(error.message);
      });
    }
  }

  showDialog(text) {
    const dialogRef = this.dialog.open(MessageBoxComponent, {
      width: '600px',
      data: {message: text}
    });
  }

  changeRoute() {
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}

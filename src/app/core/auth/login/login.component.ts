import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {AuthService} from '../../../services/auth.service';
import {auth} from '../../../shared/models/auth.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MustMatch} from '../../../shared/helper/must-match.validator';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  message = '';
  authForm: FormGroup;
  hidePassword = true;
  registerContent: boolean;
  registerForm: FormGroup;
  submitted = false;
  destroyed$ = new Subject();

  constructor(
    private dialog: MatDialog,
    private http: HttpClient,
    private authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.initForm();

  }

  private initForm() {
    this.authForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  private initRegisterForm() {
    if (!this.registerForm) {
      this.registerForm = this.fb.group({
        email: ['', [Validators.required, Validators.minLength(3), Validators.email]],
        username: [''],
        password: ['', [
          Validators.required,
          Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#])[A-Za-z\d$@$!%*?&#].{7,}')
        ]],
        confirmPassword: ['', [Validators.required, Validators.minLength(3)]],
        firstName: ['', [Validators.required]],
        lastName: [''],
        secondName: ['', [Validators.required]],
      }, {
        validator: MustMatch('password', 'confirmPassword')
      });
    }
  }

  toLogin() {
    this.http.post('/auth/token', this.authForm.value).pipe(takeUntil(this.destroyed$))
      .subscribe((data: any) => {
        if (data && data.access_token) {
          this.onSuccessLogin(data);
        } else {
          this.message = 'something went wrong';
        }
      }, (error: any) => {
        console.log(error);
        if (error && error.error && error.error.error) {
          this.message = error.error.error;
        }
      });
  }

  onSuccessLogin(data) {
    localStorage.setItem('access_token', data.access_token);
    this.authService.init();
    this.authService.getCurrentUser().pipe(takeUntil(this.destroyed$))
      .subscribe((user: auth.User) => {
        if (user) {
          this.authService.userInfo$.next(user);
        } else {
          this.authService.userInfo$.next(null);
        }
      }, error => {
        console.log(error);
      });
  }

  get login() {
    return this.authForm.controls.username;
  }

  get password() {
    return this.authForm.controls.password;
  }

  get confirmPassword() {
    return this.registerForm.controls.confirmPassword;
  }

  get registerLogin() {
    return this.registerForm.controls.email;
  }

  get registerPassword() {
    return this.registerForm.controls.password;
  }

  getLoginErrorMessage() {
    return this.login.hasError('required') ? 'Это объязательное поле!' :
      this.login.hasError('minlength') ? 'Логин должен содержать не менее 3 символов' : '';
  }

  getPasswordErrorMessage() {
    return this.password.hasError('required') ? 'Это объязательное поле!' :
      this.password.hasError('minlength') ? 'Пароль должен содержать не менее 3 символов' : '';
  }

  getRegisterLoginErrorMessage() {
    return this.registerLogin.hasError('required') ? 'Это объязательное поле!' :
      this.registerLogin.hasError('minlength') ? 'Логин должен содержать не менее 3 символов' : '';
  }

  getRegisterPasswordErrorMessage() {
    return this.registerPassword.hasError('required') ? 'Это объязательное поле!' :
      // tslint:disable-next-line:max-line-length
      this.registerPassword.hasError('pattern') ? 'Пароль должен содержать не менее 8 символов в обязательном порядке должны быть заглавные и прописные буквы и специальные символы ($@$!%*?&#).' : '';
  }

  getRegisterConfirmPasswordErrorMessage() {
    return this.confirmPassword.hasError('required') ? 'Это объязательное поле!' :
      this.confirmPassword.hasError('minlength') ? 'Пароль должен содержать не менее 8 символов' :
        this.confirmPassword.hasError('mustMatch') ? 'Пароли не совпадают' : '';
  }

  get formControls() {
    return this.registerForm.controls;
  }

  showRegisterContent() {
    this.registerContent = true;
    this.initRegisterForm();
  }

  onReset() {
    this.registerContent = false;
    this.submitted = false;
    this.registerForm.reset();
  }

  register() {
    if (this.registerContent) {
      this.submitted = true;
      if (this.registerForm.invalid) {
        return;
      }
      this.registerForm.value.username = this.registerForm.value.email;

      this.authService.register(this.registerForm.value).pipe(takeUntil(this.destroyed$))
        .subscribe(res => {
          if (res) {
            this.snackBar.open('Валидация прошла успешно! Проверьте почту чтобы пройти активацию', '', {duration: 3000});
            this.onReset();
          }
        }, error => {
          console.log(error);
          if (error.status === 409) {
            this.snackBar.open('Пользователь с такой почтой уже зарегистрирован !', '', {duration: 3000});
          }
        });
    }

  }

  reactivate() {
    if (this.login.value) {
      console.log(this.login.value);
      this.authService.reactivateUser(this.login.value).pipe(takeUntil(this.destroyed$))
        .subscribe(res => {
          if (res) {
            this.snackBar.open('Проверьте почту чтобы пройти активацию', '', {duration: 3000});
            this.message = '';
          }
        }, error1 => {
          this.snackBar.open('Упс! Что - то пошло не так !', '', {duration: 3000});
        });
    }
  }

}

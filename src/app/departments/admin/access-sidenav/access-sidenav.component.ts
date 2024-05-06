import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AdminService} from '../../../services/admin.service';
import {auth} from '../../../shared/models/auth.model';
import User = auth.User;
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-access-sidenav',
  templateUrl: './access-sidenav.component.html',
  styleUrls: ['./access-sidenav.component.scss']
})
export class AccessSidenavComponent implements OnInit {
  userId: number;
  sections: any [] = [];
  user: User = null;
  sectionForm: FormGroup;
  destroyed$ = new Subject();
  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.initForm();
    this.getMenu();
    this.getQueryParams();
  }

  async getQueryParams() {
    this.route.queryParams
      .pipe(takeUntil(this.destroyed$))
      .subscribe(params => {
      this.userId = params['userId'];
      this.getUserMenu();
      this.getUserById();
    });
  }

  async getUserMenu() {
    await this.adminService.getAvailableUserSections(this.userId).toPromise().then(res => {
      const sections = this.sectionForm.get('sections') as FormArray;
      res.forEach(section => {
        if (section.id && this.sections.length > 0) {
          sections.controls[section.id - 1].setValue(true);
        }
      });
    });
  }

  async getMenu() {
    await this.adminService.getUserMenu().toPromise().then(res => {
      this.sections = res;
      this.setSectionInForm();
    });
  }

  setSectionInForm() {
    const formArray = this.sectionForm.get('sections') as FormArray;
    this.sections.forEach(x => formArray.push(new FormControl(false)));
  }

  getUserById() {
    if (this.userId) {
      this.adminService.getUserById(this.userId)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(res => {
        if (res) {
          this.user = res;
        }
      });
    }
  }

  private initForm() {
    this.sectionForm = this.fb.group({
      sections: this.fb.array([]),
    });
  }

  prepareDate() {
    let result = Object.assign({},
      this.sectionForm.value, {
        sections: this.sections
          .filter((x, i) => !!this.sectionForm.value.sections[i])
      });

    result = result.sections.map(section => {
      const container: any = {id: section.id};
      return container;
    });
    this.save(result);
  }

  save(data) {
    this.adminService.saveUserMenu(data, this.userId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        this.adminService.openSkackbar('Разделы успешно добавлены!');
      }, (error) => {
        console.log(error);
        this.adminService.openSkackbar('Упс !', 'Ошибка');
      }
    );
  }

  cancel() {
    this.adminService.goBack();
  }
}

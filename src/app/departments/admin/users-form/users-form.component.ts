import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdminService} from '../../../services/admin.service';
import {auth} from '../../../shared/models/auth.model';
import {MatDialog, MatSnackBar} from '@angular/material';
import {UserRoleFormComponent} from '../user-role-form/user-role-form.component';
import {ActivatedRoute} from '@angular/router';
import {dic} from '../../../shared/models/dictionary.model';
import {DicApplicationService} from '../../../services/dic.application.service';
import User = auth.User;
import Organization = dic.Organization;
import {Region} from '../../../components/select-region/model/region.model';
import {SelectRegionComponent} from '../../../components/select-region/select-region.component';
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-users-form',
  templateUrl: './users-form.component.html',
  styleUrls: ['./users-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UsersFormComponent implements OnInit {
  dataSource: any[] = [];
  displayedColumns: string[] = ['number', 'service', 'role', 'name', 'action'];
  emailForm: FormGroup;
  userForm: FormGroup;
  submitted: boolean;
  userSubmitted: boolean;
  user: User = null;
  hasUser: boolean;
  userId: number = null;
  organizations: Organization[] = [];
  organizationsCopy: Organization[] = [];
  regions: Region[] = [];
  @ViewChild(SelectRegionComponent, {static: false})
  public regionComponent: SelectRegionComponent;
  destroyed$ = new Subject();
  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private dicSvc: DicApplicationService
  ) {
  }

  ngOnInit() {
    this.route.queryParams.pipe(takeUntil(this.destroyed$))
      .subscribe(params => {
      this.userId = params['userId'];
      this.getUserById();
    });
    this.initForm();
    this.initLoginForm();
    this.getOrganizations();

  }

  getRegions() {
    this.dicSvc.getRegionsReq().pipe().pipe(takeUntil(this.destroyed$))
      .subscribe(data => {
      this.regions = data ? [...this.regions, ...data] : this.regions;
    });
  }

  getOrganizations() {
    this.adminService.getOrganizations().pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
      this.organizations = this.adminService.sortDataByField(res, 'nameRu');
      this.organizationsCopy = this.organizations;
    });
  }

  private initForm() {
    this.emailForm = this.fb.group({
      emailForSearch: ['', [Validators.required, Validators.email]],
    });
  }

  private initLoginForm() {
    this.userForm = this.fb.group({
      id: [''],
      username: [''],
      email: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      secondName: [''],
      lastName: ['', [Validators.required]],
      regionId: ['', [Validators.required]],
      positionRu: [''],
      positionKk: [''],
      iin: [''],
      organization: this.fb.group({
        id: ['']
      }),
    });
  }

  getUserById() {
    if (this.userId) {
      this.adminService.getUserById(this.userId).pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        if (res) {
          this.user = res;
          this.hasUser = true;
          this.setUser();
          this.getUserRoles();
        }
      });
    }
  }

  get formControls() {
    return this.emailForm.controls;
  }

  get userFormControls() {
    return this.userForm.controls;
  }

  search() {
    this.submitted = true;
    if (this.emailForm.invalid) {
      return false;
    }

    this.adminService.getUserByEmailFromEatyrau(this.emailForm.controls.emailForSearch.value).pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
      if (res) {
        res.id = null;
        this.user = res;
        this.setUser();
      } else {
        this.hasUser = false;
      }
    }, error1 => this.hasUser = false);
  }

  setUser() {
    this.adminService.setForm(this.userForm.controls, this.user);
    this.regionComponent.setCurrentRegionById(this.user.regionId);
  }

  validateUser() {
    this.userSubmitted = true;
    if (this.userForm.invalid) {
      return false;
    }
    if (this.userForm.controls.id.value) {
      this.updateUser();
    } else {
      this.saveUser();
    }

  }

  updateUser() {
    this.adminService.updateUser(this.userForm.value).pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
      this.snackBar.open('Пользователь редактирован успешно!', '', {duration: 3000});
      this.hasUser = true;
      this.userSubmitted = false;
    });
  }

  saveUser() {
    this.adminService.saveUser(this.userForm.value).pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
      this.snackBar.open('Пользователь добавлен успешно!', '', {duration: 3000});
      this.hasUser = true;
      this.userSubmitted = false;
    });
  }

  edit(role) {
    this.openUserRoleFormModal(role);
  }

  openUserRoleFormModal(role: any = null) {
    const dialogRef = this.dialog.open(UserRoleFormComponent, {
      width: '600px',
      data: {user: this.user, userRole: role}
    });

    dialogRef.afterClosed().pipe(takeUntil(this.destroyed$))
      .subscribe((result: any) => {
      if (result) {
        this.snackBar.open('Пользователь успешно изменен!', null, {
          duration: 3000
        });
        this.getUserRoles();
      }
    });
  }

  delete(role: any) {
    this.adminService.removeUserRole(role.id).pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
      this.getUserRoles();
      this.snackBar.open('Роль пользователя успешно удален!', null, {
        duration: 3000
      });
    });
  }

  getUserRoles() {
    if (this.user) {
      this.adminService.getUserRoles(this.user.username).pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        this.dataSource = res;
      });
    }
  }

  searchByOrganization(query: string) {
    const result = this.adminService.optionSelect(query, this.organizations, 'nameRu');
    this.organizationsCopy = result;
  }

  goBack() {
    this.adminService.goBack();
  }

  setSelectedRegionId(id) {
    this.userForm.controls.regionId.setValue(id);
  }

}

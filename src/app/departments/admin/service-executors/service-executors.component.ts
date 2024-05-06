import {AfterViewInit, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Location} from '@angular/common';
import {AdminService} from '../../../services/admin.service';
import {MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {auth} from '../../../shared/models/auth.model';
import {dic} from '../../../shared/models/dictionary.model';
import {TranslateService} from '@ngx-translate/core';
import * as _ from 'lodash';
import {DicApplicationService} from '../../../services/dic.application.service';
import User = auth.User;
import Subservices = dic.Subservices;
import {Region} from '../../../components/select-region/model/region.model';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';


@Component({
  selector: 'app-service-executors',
  templateUrl: './service-executors.component.html',
  styleUrls: ['./service-executors.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ServiceExecutorsComponent implements OnInit, AfterViewInit {
  serviceId: number;
  dataSource: any[] = [];
  displayedColumns: string[] = ['position', 'roleNameRu', 'region', 'user'];
  userAndRoleForm: FormGroup;
  roles: any[] = [];
  users: User[] = [];
  reserveUsers: User[] = [];
  subservice: Subservices = new Subservices();
  submitted: boolean;
  isForm: boolean;
  currentLang;
  regions: Region[] = [];
  regionId: any;
  destroyed$ = new Subject();
  members: any[] = [];

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private router: Router,
    private dicSvc: DicApplicationService
  ) {
    this.currentLang = this.translate.currentLang ? this.translate.currentLang : this.translate.getDefaultLang();
  }

  ngOnInit() {
    this.route.queryParams
      .pipe(takeUntil(this.destroyed$))
      .subscribe(params => {
        this.serviceId = params['serviceId'];
        this.getServiceById();
      });
    this.initForm();
    this.getRoles();
    this.getUsers();
    this.initTranslate();
    this.getRegions();
  }

  getRegions() {
    this.dicSvc.getRegions().then((res: Region[]) => {
      this.regions = res;
    });
  }

  ngAfterViewInit() {
    this.getMembers();
  }

  initTranslate() {
    this.translate.onLangChange.pipe(takeUntil(this.destroyed$))
      .subscribe((event: any) => {
        this.currentLang = event.lang;
      });
  }

  initForm() {
    this.userAndRoleForm = this.fb.group({
      roleId: ['', [Validators.required]],
      username: ['', [Validators.required]],
      current: [''],
      regionId: null
    });
  }

  get formControls() {
    return this.userAndRoleForm.controls;
  }

  getMembers() {
    if (this.serviceId) {
      let regionId = this.regionId;
      this.adminService.getMembersById(this.serviceId, regionId).pipe(takeUntil(this.destroyed$))
        .subscribe(res => {
          this.members = res;
          this.dataSource = this.prepareForDisplayInTable(res);
          this.addRoleToTableWithoutUser(res);
          this.dataSource = this.adminService.sortDataByField(this.dataSource, 'num');
        });
    }
  }

  prepareForDisplayInTable(data) {
    const members = this.prepareAndCorrectData(data);
    const users = members.map((item) => item.user);
    return this.groupebByUsers(users);
  }

  prepareAndCorrectData(members) {
    members.forEach((item) => {
      if (item.user) {
        item.user.role = item.role;
        item.user.roleId = item.role.id;
        item.user.num = item.role.num;
        item.user.userRoleId = item.id;
        item.user.current = item.current;
      } else {
        item.user = {
          roleName: item.role.nameRu || item.role.shortNameRu,
          num: item.role.num
        };
      }
    });
    return members;
  }

  groupebByUsers(users) {
    const grouped = _.mapValues(_.groupBy(users, 'roleId'),
      clist => clist.map(user => _.omit(user, 'roleId')));

    const result = [];
    for (const [key, value] of Object.entries(grouped)) {
      result.push(value);
      result[result.length - 1].num = value[0].num;
    }


    return result;
  }

  addRoleToTableWithoutUser(members) {
    this.roles.forEach(role => {
      const hasRole = members.some(member => member.role.id === role.id);
      if (!hasRole) {
        this.dataSource.push([{role: role}]);
        this.dataSource[this.dataSource.length - 1].num = role.num;
      }
    });
  }

  getRoleName(user) {
    if (user) {
      return user[0].role.nameRu;
    }
  }

  getRoles() {
    this.adminService.getRoles(this.serviceId).pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        this.roles = res.content;
      });
  }

  getUsers() {
    this.adminService.getUsersWithoutPage().pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        res = res.filter(user => user.username);
        this.users = this.adminService.sortDataByField(res, 'username');
        this.reserveUsers = this.users;
      });
  }

  getServiceById() {
    if (this.serviceId) {
      this.adminService.getServiceById(this.serviceId).pipe(takeUntil(this.destroyed$))
        .subscribe(res => {
          this.subservice = res;
        });
    }
  }

  refresh() {
    this.dataSource = null;
    this.getMembers();
  }

  validate() {
    this.submitted = true;
    if (this.userAndRoleForm.invalid) {
      return;
    }
    this.renderDate();
  }

  renderDate() {
    const data: any = {
      username: this.formControls['username'].value,
      role: {id: this.formControls['roleId'].value},
      subservice: {id: this.serviceId},
      regionId: this.formControls['regionId'].value,
      current: this.formControls['current'].value ? true : false
    };
    this.save(data);
  }

  getUserRegionIdByUserName() {
    const selectUser = this.users.find(user => user.username === this.userAndRoleForm.controls.username.value);
    if (selectUser) {
      return selectUser.regionId;
    }
  }

  setSelectedRegionIdInUserAndRoleForm(id) {
    this.userAndRoleForm.controls['regionId'].setValue(id);
  }

  save(data) {
    this.adminService.giveUserRoleAndSubservice(data).pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        this.refresh();
        this.resetForm();
        this.snackBar.open('Пользователю успешно добавлено БП и Роль!', null, {
          duration: 3000
        });
      });
  }

  resetForm() {
    this.userAndRoleForm.reset();
    this.submitted = false;
    this.isForm = false;
  }

  edit(userRole: any) {
    this.setForm(userRole.username, userRole.role.id);
    this.showForm();
  }

  setForm(username, roleId) {
    this.formControls['username'].setValue(username);
    this.formControls['roleId'].setValue(roleId);
  }

  delete(userRoleId: any) {
    if (confirm(this.currentLang === 'ru' ? `Удалить поьзователя ?'` : `Сіз осы қолданушыны өшіргіңіз келе ме?`)) {
      this.adminService.removeUserRole(userRoleId).pipe(takeUntil(this.destroyed$))
        .subscribe(res => {
          this.refresh();
          this.resetForm();
          this.snackBar.open('Роль пользователя успешно удален!', null, {
            duration: 3000
          });
        });
    }
  }

  deleteRole(userRole: any) {
    if (userRole.id) {
      this.snackBar.open('Нельзя удалять роль при наличии пользователей!', 'Ошибка', {
        duration: 3000
      });
    } else {
      if (confirm(this.currentLang === 'ru' ? `Удалить роль '${userRole.role.nameRu}?'` : `Сіз осы ролды өшіргіңіз келе ме? '${userRole.role.name}'`)) {
        this.adminService.removeRoleFromService(this.subservice.id, userRole.role.id).pipe(takeUntil(this.destroyed$))
          .subscribe(res => {
            if (res) {
              this.snackBar.open('Роль успешно удален!', '', {duration: 3000});
              this.getRoles();
              this.refresh();
            }
          });
      }
    }
  }

  editRole(id: number) {
    const params: any = {roleId: id};
    this.changeRoute('/admin/roles/add', params);
  }

  showForm() {
    this.isForm = true;
  }

  goBack() {
    this.adminService.goBack();
  }

  addRoleToService() {
    const params: any = {serviceId: this.serviceId};
    this.changeRoute('/admin/roles/add', params);
  }

  changeRoute(url: any, params: any = null) {
    this.router.navigate([url], {
      queryParams: params
    });
  }

  getUserRoleRegionById(id) {
    const userRole = this.members.find(member => member.id === id);
    if (userRole) {
      const result = this.getUserRegionById(userRole.regionId)
      return result;
    }
  }

  public getUserRegionById(regionId) {
    const region = this.dicSvc.getRegionById(this.regions, regionId);
    if (!region) {
      return 'г. Тараз';
    }
    return `(${region.nameRu})`;
  }

  setSelectedRegionId(id) {
    this.regionId = id;
  }

  searchByUsers(query: string) {
    const result = this.adminService.optionSelect(query, this.users, 'firstName', 'lastName', 'username');
    this.reserveUsers = result;
  }

  getUserColor(val) {
    return val ? '#31B52E' : '#000000';
  }

}

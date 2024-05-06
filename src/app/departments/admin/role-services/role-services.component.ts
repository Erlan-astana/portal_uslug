import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AdminService} from '../../../services/admin.service';
import {TranslateService} from '@ngx-translate/core';
import {MatSnackBar} from '@angular/material';
import {FormControl, Validators} from '@angular/forms';
import {dic} from '../../../shared/models/dictionary.model';
import Subservices = dic.Subservices;
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-role-services',
  templateUrl: './role-services.component.html',
  styleUrls: ['./role-services.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RoleServicesComponent implements OnInit {
  roleId: number;
  dataSource: any[] = [];
  displayedColumns: string[] = ['position', 'name', 'nameRu', 'shortNameRu', 'description', 'action'];
  currentLang;
  isForm: boolean;
  roleName: string;
  serviceControl = new FormControl('', Validators.required);
  subservices: Subservices[] = [];
  reserveSubservices: Subservices[] = [];
  destroyed$ = new Subject();
  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private translate: TranslateService,
    private snackBar: MatSnackBar
  ) {
    this.currentLang = this.translate.currentLang ? this.translate.currentLang : this.translate.getDefaultLang();
  }

  ngOnInit() {
    this.getQueryParams();
    this.getSubservices();
  }

  getQueryParams() {
    this.route.queryParams.pipe(takeUntil(this.destroyed$))
      .subscribe(params => {
      this.roleId = params['roleId'];
      this.roleName = params['name'];
      this.getRoleSubservices();
    });
  }

  getRoleSubservices() {
    if (this.roleId) {
      this.adminService.getRoleSubservices(this.roleId).pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        this.dataSource = res;
      });
    }
  }

  getSubservices() {
    this.adminService.getSubservices(0, 100, '').pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
      this.subservices = res.content;
      this.reserveSubservices = this.subservices;
    });
  }

  validate() {
    if (this.serviceControl.invalid) {
      return;
    }
    this.renderDate();
  }

  renderDate() {
    const data: any = {
      role: {id: this.roleId},
      subservice: {id: this.serviceControl.value}
    };
    this.save(data);
  }

  save(data: any) {
    console.log(this.serviceControl);
    this.adminService.setSubserviceInRole(data, this.roleId).pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
      if (res) {
        this.refresh();
        this.isForm = false;
        this.snackBar.open('В Роль успешно добавлено БП', null, {
          duration: 3000
        });
      }
    });
  }

  delete(roleSubservice: any) {
    if (confirm(this.currentLang === 'ru' ? `Удалить услугу из роли ? ?'` : `Удалить услугу из роли ?`)) {
      this.adminService.removeRoleSubservices(roleSubservice.role.id, roleSubservice.id).pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        this.refresh();
        this.snackBar.open('Услуга из Роля успешно удален!', null, {
          duration: 3000
        });
      });
    }
  }

  searchByServices(query: string) {
    const result = this.adminService.optionSelect(query, this.subservices, 'nameRu');
    this.reserveSubservices = result;
  }

  refresh() {
    this.dataSource = null;
    this.getRoleSubservices();
  }

  showForm() {
    this.isForm = true;
  }

  resetForm() {
    this.serviceControl.reset();
    this.isForm = false;
  }

  goBack() {
    this.adminService.goBack();
  }

}

import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {dic} from '../../../shared/models/dictionary.model';
import {AdminService} from '../../../services/admin.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import Role = dic.Role;
import {TranslateService} from '@ngx-translate/core';
import {FileService} from '../../../services/file.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from "rxjs";

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RolesComponent implements OnInit, OnDestroy {
  dataSource: dic.Role[] = [];
  displayedColumns: string[] = ['position', 'name', 'nameRu', 'shortNameRu', 'description', 'action'];
  currentPage = 1;
  pageSize = 20;
  totalElements: number = null;
  currentLang;
  name: string = '';
  destroyed$ = new Subject();
  constructor(
    private adminService: AdminService,
    private router: Router,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private fileService: FileService
  ) {
    this.currentLang = this.translate.currentLang ? this.translate.currentLang : this.translate.getDefaultLang();
  }

  ngOnInit() {
    this.getLastPageNumber();
    this.getRoles();
    this.initTranslate();
  }

  public getLastPageNumber() {
    const pageInfo = this.adminService.getPaginationInfo();
    if (pageInfo.name === this.constructor.name) {
      this.currentPage = pageInfo.number;
    }
  }

  initTranslate() {
    this.translate.onLangChange
      .pipe(takeUntil(this.destroyed$))
      .subscribe((event: any) => {
        this.currentLang = event.lang;
      });
  }

  getRoles() {
    this.adminService.getRoleList(this.currentPage - 1, this.pageSize, this.name)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        this.dataSource = res.content;
        this.totalElements = res.totalElements;
      });
  }

  getCount() {
    return (this.currentPage - 1) * 10;
  }

  create() {
    this.changeRoute('/admin/roles/add');
  }

  changeRoute(url: any, params: any = null) {
    this.router.navigate([url], {
      queryParams: params
    });
  }

  edit(id: number) {
    const params: any = {roleId: id};
    this.changeRoute('/admin/roles/add', params);
  }

  goToroleService(role: any) {
    const params: any = {roleId: role.id, name: role.name};
    this.changeRoute('/admin/roles/subservices', params);
  }

  delete(role: Role) {
    if (confirm(this.currentLang === 'ru' ? `Удалить роль '${role.nameRu}?'` : `Сіз осы ролды өшіргіңіз келе ме? '${role.name}'`)) {
      this.adminService.removeRole(role.id)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(res => {
          if (res) {
            this.snackBar.open('Роль успешно удален!', '', {duration: 3000});
            this.refresh();
          }
        });
    }
  }

  refresh() {
    this.name = '';
    this.getRoles();
  }

  pageChange(event) {
    this.currentPage = event;
    this.adminService.setPaginationInfo(this.constructor.name, event);
    this.getRoles();
  }

  public downloadExcelFile() {
    this.fileService.generateExcelFileWithDifferentData('export-roles', 'roles');
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}

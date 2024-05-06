import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {auth} from '../../../shared/models/auth.model';
import {AdminService} from '../../../services/admin.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {FileService} from '../../../services/file.service';
import {DicApplicationService} from '../../../services/dic.application.service';
import {Region} from '../../../components/select-region/model/region.model';
import User = auth.User;
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UsersComponent implements OnInit {
  dataSource: User[] = [];
  displayedColumns: string[] = ['number', 'username', 'email', 'fio', 'position', 'organization', 'role', 'action'];
  currentPage = 1;
  pageSize = 20;
  totalElements: number = null;
  currentLang;
  regions: Region[] = [];
  searchText: string = '';
  destroyed$ = new Subject();

  constructor(
    private adminService: AdminService,
    private router: Router,
    private snackBar: MatSnackBar,
    private fileService: FileService,
    private dicService: DicApplicationService
  ) {
  }

  ngOnInit() {
    this.getLastPageNumber();
    this.getUsers();
    this.getRegions();
  }

  public getLastPageNumber() {
    const pageInfo = this.adminService.getPaginationInfo();
    if (pageInfo.name === this.constructor.name) {
      this.currentPage = pageInfo.number;
    }
  }


  getUsers() {
    this.adminService.getUsers(this.currentPage - 1, this.pageSize, this.searchText)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        this.dataSource = res.content;
        this.totalElements = res.totalElements;
      });
  }

  getCount() {
    return (this.currentPage - 1) * 20;
  }

  refresh() {
    this.getUsers();
  }

  create() {
    this.changeRoute('/admin/users/add');
  }

  edit(id: number) {
    const params: any = {userId: id};
    this.changeRoute('/admin/users/edit', params);
  }

  toInterface(user) {
    const params: any = {userId: user.id};
    this.changeRoute('/admin/users/access', params);
  }

  changeRoute(url: any, params: any = null) {
    this.router.navigate([url], {
      queryParams: params
    });
  }

  delete(id: number) {
    this.adminService.removeUser(id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        this.getUsers();
        this.snackBar.open('Пользователь успешно удален!', null, {
          duration: 3000
        });
      });
  }

  pageChange(event) {
    this.currentPage = event;
    this.adminService.setPaginationInfo(this.constructor.name, event);
    this.getUsers();
  }

  public downloadExcelFile() {
    this.fileService.generateExcelFileWithDifferentData('export-users', 'users');
  }

  getRegions() {
    this.dicService.getRegions().then((data: Region[]) => {
      this.regions = data;
      const regionWithChildren = (this.regions.find(region => region.children.length > 0));
      this.regions = this.regions.concat(regionWithChildren.children);
    });
  }

  public getRegionById(regionId) {
    const region = this.dicService.getRegionById(this.regions, regionId);
    if (!region) {
      return 'г. Тараз';
    }
    return `(${region.nameRu})`;
  }
}

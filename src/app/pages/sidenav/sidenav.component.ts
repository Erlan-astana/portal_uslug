import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {auth} from '../../shared/models/auth.model';
import {AuthService} from '../../services/auth.service';
import {ProblemService} from '../../services/problem.service';
import {Subject, Subscription} from 'rxjs';
import {ROLES} from '../../shared/utils/constants';
import {TranslateService} from '@ngx-translate/core';
import {AdminService} from '../../services/admin.service';
import {takeUntil} from 'rxjs/operators';

interface List {
  name: string;
  id: number;
  url: string;
  count: number;
  children?: List[];
}


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidenavComponent implements OnInit, OnDestroy {
  allSections: any;
  sections: List[] = [
    {
      name: 'CorrespondenceIn',
      id: 16,
      url: 'directory/correspondences/incomingCorrespondences',
      count: null,
      children: [],
    },
    {
      name: 'CorrespondenceOut',
      id: 17,
      url: 'directory/correspondences/outcomingCorrespondences',
      count: null,
      children: [],
    },
    {
      name: 'AdmDocuments',
      id: 19,
      url: 'directory/documents',
      count: null,
      children: [],
    },
    {
      name: 'Contracts',
      id: 191,
      url: 'directory/contracts',
      count: null,
      children: [],
    },
    {
      name: 'ContractExecutions',
      id: 192,
      url: 'directory/contractExecutions',
      count: null,
      children: [],
    },
    {
      name: 'ExternalInbox',
      id: 33,
      url: 'arch/incoming',
      count: null,
      children: [],

    },
    {
      name: 'TasksGeneral',
      id: 8,
      url: 'arch/allTasks',
      count: null,
      children: [],
    },
    {
      name: 'SentGeneral',
      id: 4,
      url: 'arch/outcoming',
      count: null,
      children: [],

    },
    {
      name: 'RevokedTasks',
      id: 44,
      url: 'arch/revoked',
      count: null,
      children: [],

    },
    {
      name: 'OnControl',
      id: 5,
      url: 'arch/control',
      count: null,
      children: [],

    },
    {
      name: 'MyDesignated',
      id: 9,
      url: 'arch/currentTasks',
      count: null,
      children: [],

    },
    {
      name: 'MyExecuted',
      id: 3,
      url: 'arch/finishedTasks',
      count: null,
      children: [],
    },

    {
      name: 'monitoringContract',
      id: 199,
      url: 'directory/monitoringContract',
      count: null,
      children: [],
    },
    {
      name: 'monitoringZu',
      id: 25,
      url: 'directory/monitoringZu',
      count: null,
      children: [],
    },
    {
      name: 'Statistics',
      id: 15,
      url: 'admin/statistic',
      count: null,
      children: [],

    },
    {
      name: 'ServiceStatistics',
      id: 118,
      url: 'admin/serviceStatistics',
      count: null,
      children: [],
    },
    {
      name: 'Reports',
      id: 24,
      url: 'admin/reports',
      count: null,
      children: [],
    },
    {
      name: 'Specreg',
      id: 31,
      url: 'specreg',
      count: null,
      children: [],
    },
    {
      name: 'SpecregJournal',
      id: 32,
      url: 'specreg/specregJournal',
      count: null,
      children: [],
    },
    {
      name: 'Admin',
      id: 1,
      url: 'admin/admin',
      count: null,
      children: [
        {
          name: 'TemplateEditor',
          id: 11,
          url: 'admin/templateEditor',
          count: null,
          children: [],
        },
        {
          name: 'SubjectTemplateEditor',
          id: 22,
          url: 'admin/subjectTemplateEditor',
          count: null,
          children: [],
        },
        {
          name: 'UserDirectory',
          id: 13,
          url: 'admin/users',
          count: null,
          children: [],

        },
        {
          name: 'Service',
          id: 14,
          url: 'admin/services',
          count: null,
          children: [],

        },
        {
          name: 'RoleDirectory',
          id: 12,
          url: 'admin/roles',
          count: null,
          children: [],

        },
        {
          name: 'referenceBook',
          id: 112,
          url: 'admin/comments',
          count: null,
          children: [],

        },
        {
          name: 'ContractorReport',
          id: 113,
          url: 'arch/executorReport',
          count: null,
          children: [],
        },
        {
          name: 'ActionTasks',
          id: 18,
          url: 'arch/appOperations',
          count: null,
          children: [],
        },
      ],
    },
  ];
  isSidenav = false;
  serviceIndex = 0;
  currentUser = auth.User = null;
  menu: any;
  subscription: Subscription;
  isRoleArch: boolean = false;
  isRoleOZO: boolean = false;
  isRoleCom: boolean = false;
  unassignedTasks: number;
  currentLang;
  destroyed$ = new Subject();

  constructor(
    private router: Router,
    private api: ApiService,
    private authService: AuthService,
    private taskService: ProblemService,
    private translate: TranslateService,
    private adminService: AdminService
  ) {
    this.subscription = this.taskService.getMenu()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(menu => {
        if (menu.data) {
          this.menu = menu.data;
          this.getSectionCount();
          this.addAdminSections();

          this.showAvailableSections(this.menu.access);
        } else {
          this.showAvailableSections([]);
        }
      });
    this.currentLang = this.translate.currentLang ? this.translate.currentLang : this.translate.getDefaultLang();
  }

  ngOnInit() {
    this.getCurrentUser();
    this.allSections = this.sections;
    this.initTranslate();
  }

  initTranslate() {
    this.translate.onLangChange
      .pipe(takeUntil(this.destroyed$))
      .subscribe((event: any) => {
        this.currentLang = event.lang;
      });
  }

  getWidhtSize(isSidenav) {
    switch (isSidenav) {
      case true:
        return 38;
      case false:
        return 23;
    }
  }

  setServiceIndex(index) {
    if (this.serviceIndex === index && index === 1) {
      this.serviceIndex = 1000;
    } else {
      this.serviceIndex = index;
    }

  }

  changeRoute(data: any) {
    this.adminService.setPaginationInfo(null, null);
    if (data.id !== 1) {
      if (data.url) {
        this.router.navigate([`${data.url}`], {queryParams: {id: data.id, name: data.name}});
      }
    }

  }

  checkForActivity(index) {
    return this.serviceIndex === index;
  }

  getSectionCount() {
    const menu = this.menu;
    this.unassignedTasks = menu.unassignedTasks;
    for (const prop in menu) {
      this.sections.forEach(section => {
        if (section.url && section.url.indexOf(prop) !== -1) {
          section.count = menu[prop];
        }
      });
    }

  }

  getCurrentUser() {
    this.authService.userInfo$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data: any) => {
        if (data) {
          this.currentUser = data;
          this.taskService.getSidenavMenuCounts();
          this.checkCurrentUserRoles();
        } else {
          this.currentUser = null;
        }
      });
  }


  checkCurrentUserRoles() {
    this.isRoleArch = this.authService.hasRole(ROLES.BPM_ARCH);
    this.isRoleCom = this.authService.hasRole(ROLES.BPM_COM);
    if (!this.isRoleArch) {
      this.isRoleOZO = this.authService.hasRole(ROLES.BPM_OZO);
    }
  }

  addAdminSections() {
    const hasAdmin = this.authService.hasRole(ROLES.ADMIN);
    if (hasAdmin) {
      this.menu.access.push('admin');
      //this.taskService.sendMenu({access: ['admin']});
    }
  }

  showAvailableSections(sectionNames) {
    if (sectionNames.length > 0) {
      this.sections = this.allSections;
      const sections = this.sections.filter(item => {
        const sectionName = item.url.split('/');
        if (sectionNames.includes(sectionName[sectionName.length - 1])) {
          return item;
        }
      });
      this.sections = sections;
    } else {
      this.sections = [];
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

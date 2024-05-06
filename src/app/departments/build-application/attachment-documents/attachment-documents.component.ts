import {Component, OnInit, ViewChild} from '@angular/core';
import {dic} from '../../../shared/models/dictionary.model';
import {FileService} from '../../../services/file.service';
import {app} from '../../../shared/models/application.model';
import {DicApplicationService} from '../../../services/dic.application.service';
import {ApplicationService} from '../../../services/application.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {MatSnackBar} from '@angular/material';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {AdminService} from '../../../services/admin.service';
import {FilesUploadComponent} from "../../../components/files-upload/files-upload.component";


@Component({
  selector: 'app-attachment-documents',
  templateUrl: './attachment-documents.component.html',
  styleUrls: ['./attachment-documents.component.scss']
})
export class AttachmentDocumentsComponent implements OnInit {
  @ViewChild(FilesUploadComponent, {static: false})
  public fileComponent: FilesUploadComponent;
  app: app.App;
  appId: number = null;
  appFileCategories: dic.CategoryFiles[] = [];
  currentLang;
  subserviceId: any;
  currentNavLinks: any;
  nextNavPosition = 5;
  prevPosition = 3;
  reserveAppFileCategories: dic.CategoryFiles[] = [
    {
      extensions: 'application/pdf',
      id: 92,
      required: true,
      subserviceId: 21,
      title: 'Доверенность',
      titleKk: 'Сенімхат',
      titleRu: 'Доверенность',
      type: 'POWER_OF_ATTORNEY',
      categoryFiles: [],
      categoryFilesUpload: [],
      display: false
    }
  ];
  destroyed$ = new Subject();
  stateTU: boolean = true;

  constructor(
    private dicSvc: DicApplicationService,
    private appSvc: ApplicationService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private fileSvc: FileService,
    private router: Router,
    private snackBar: MatSnackBar,
    private adminService: AdminService
  ) {
    this.currentLang = this.translate.currentLang ? this.translate.currentLang : this.translate.getDefaultLang();
  }

  ngOnInit() {
    this.getApplication();
    this.getAppFileCategories();
    this.translate.onLangChange.pipe(takeUntil(this.destroyed$))
      .subscribe((event: any) => {
        this.currentLang = event.lang;
      });
  }

  getApplication() {
    this.app = this.appSvc.getApp();
    if (!this.app.id) {
      this.getQueryParams();
    } else {
      this.subserviceId = this.app.subservice.id;
      this.setNavLink();
    }
  }

  getQueryParams() {
    this.route.queryParams.pipe(takeUntil(this.destroyed$))
      .subscribe(params => {
        this.appId = parseInt(params['appId']);
        this.subserviceId = params['subserviceId'];
        this.getAppById();
      });
  }

  getAppById() {
    if (this.appId) {
      this.appSvc.getAppReq(this.appId).pipe(takeUntil(this.destroyed$))
        .subscribe(res => {
          this.app = res;
          this.appSvc.setApp(res);
          this.getAppFileCategories();
          this.setNavLink();
        });
    }
  }

  private getAppFileCategories() {
    if (!this.app.id) {
      return;
    }
    this.dicSvc.getAppFileCategories(this.subserviceId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((fileCategories: dic.CategoryFiles[]) => {
        fileCategories.map(file => {
          file.categoryFiles = [];
          file.categoryFilesUpload = [];
        });
        if (this.app.subservice.id === 21) {
          fileCategories = this.sortFileCategoriesByTitle(fileCategories);
        }
        this.appFileCategories = fileCategories;
        if (this.app.otherApplicant) {
          this.appFileCategories = this.appFileCategories.concat(this.reserveAppFileCategories);
        }

      });
  }

  sortFileCategoriesByTitle(fileCategories) {
    return this.adminService.sortDataByField(fileCategories, 'title');
  }

  public changeOzoFiles() {
    if (this.app.subservice.id === 25 && this.app.objectInfo.purpose.trim().toUpperCase() === 'ИЖС') {
      const fileIndex = this.appFileCategories.findIndex(file => file.id === 160);
      this.appFileCategories[fileIndex].required = true;
    }
  }

  setNavLink() {
    this.currentNavLinks = this.appSvc.getNavLink(this.subserviceId);
    this.getNavPositions();
  }

  getNavPositions() {
    const currentNavPosition = this.appSvc.getCurrentNavPosition(this.router.url, this.currentNavLinks);
    this.nextNavPosition = currentNavPosition + 1;
    this.prevPosition = currentNavPosition - 1;
  }

  checkfiles() {
    if (!this.fileSvc.checkingFileCategoriesForRequired(this.app, this.appFileCategories)) {
      const msg = this.currentLang === 'ru' ? 'Электронные копии документов. Не загружены обязательные документы.'
        : 'Құжаттардың электрондық көшірмелері. Міндетті құжаттар жүктелмеген.';
      this.snackBar.open(msg, '', {duration: 3000});
    } else {
      this.redirecToNextStep();
    }
  }

  redirecToNextStep() {
    if (!this.stateTU || !this.hasApzBysubserviceId()) {
      this.changeRoute(this.currentNavLinks[this.nextNavPosition], this.nextNavPosition);
    } else {
      const currentNavLinksLastInd = this.currentNavLinks.length - 1;
      this.changeRoute(this.currentNavLinks[currentNavLinksLastInd], currentNavLinksLastInd);
    }
  }

  ToggleApzTuFiles() {
    console.log(this.stateTU);
    this.sendTuFileState(this.stateTU);
    this.fileComponent.fileCategories.forEach((file => {
      if (file.type === 'OWN_TU_SPECIFICATIONS') {
        file.display = !this.stateTU;
        file.required = this.stateTU;
      }
    }));
  }

  sendTuFileState(val: boolean) {
    this.appSvc.sendSubjectTuFile(val);
  }

  hasApzBysubserviceId() {
    const availableIds = [1, 2, 3, 4, 9, 41, 42, 43, 44, 49];
    const id = parseInt(this.subserviceId);
    return availableIds.some(role => role === id);
  }

  changeRoute(url, position) {
    this.appSvc.sendBuildAppUrl(position);
    const params: any = {appId: this.app.id, subserviceId: this.subserviceId};
    this.router.navigate([url], {
      queryParams: params
    });
  }
}

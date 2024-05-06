import {
  AfterViewChecked,
  Component,
  EventEmitter,
  Input,
  OnChanges, OnDestroy,
  OnInit,
  Output, ViewChildren,
} from '@angular/core';
import {dic} from '../../shared/models/dictionary.model';
import {FileService} from '../../services/file.service';
import {app} from '../../shared/models/application.model';
import {ApiService} from '../../services/api.service';
import {DicApplicationService} from '../../services/dic.application.service';
import {TranslateService} from '@ngx-translate/core';
import {ProblemService} from '../../services/problem.service';
import {auth} from '../../shared/models/auth.model';
import User = auth.User;
import {MatSnackBar} from '@angular/material';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-files-upload',
  templateUrl: './files-upload.component.html',
  styleUrls: ['./files-upload.component.scss']
})
export class FilesUploadComponent implements OnInit, OnChanges, AfterViewChecked, OnDestroy {
  @ViewChildren('fileTitle') fileTitles: any;
  @Output() changeSignData = new EventEmitter();
  @Output() updateTask = new EventEmitter<any>();
  @Input() fileCategories: dic.CategoryFiles[];
  @Input() app: app.App;
  @Input() taskDecide: dic.Decide;
  @Input() type: string;
  @Input() currentUser: User;
  @Input() sectionId: any;
  fileTitleChanged: boolean;
  currentLang;
  reserveTaskDecide: dic.Decide = new dic.Decide();
  destroyed$ = new Subject();
  files: any[] = [];

  hideFileCat = ['TECH_CONDITION_WATER', 'TECH_CONDITION_TEPLO', 'TECH_CONDITION_GAS', 'TECH_CONDITION_KAZAHTELECOM',
    'TECH_CONDITION_ENERGO', 'TECH_CONDITION_TRANSTELECOM', 'TECH_CONDITION_OZO', 'ACT_FINAL', 'ACT_REJECT', 'ACT_APPROVE',
    'TECH_CONDITION_BAIZAKSU', 'TECH_CONDITION_IGILIK', 'TECH_CONDITION_MERKISU', 'TECH_CONDITION_KORDAISU',
    'TECH_CONDITION_AKSUKORDAI', 'TECH_CONDITION_JANATASSUJYLU', 'INTERNAL_FILES', , 'TECH_CONDITION_ZHAMBYL_ZHYLU',
    'TECH_CONDITION_ZHAMBYL_SU', 'TECH_CONDITION_ZHES', 'ACT_FINAL_MERGED', 'RESULT_POST'];

  constructor(
    private fileSvc: FileService,
    private api: ApiService,
    private dicSvc: DicApplicationService,
    private translate: TranslateService,
    private taskService: ProblemService,
    private snackBar: MatSnackBar) {
    this.currentLang = this.translate.currentLang ? this.translate.currentLang : this.translate.getDefaultLang();
  }


  /**
   * on file drop handler
   */
  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.uploadFilesSimulator(0);
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }


  ngOnChanges() {
    if (this.app) {
      this.getAppFiles(this.app.id);
    }
  }

  ngOnInit() {
    this.initTranslate();
    if (this.app) {
      this.getAppFiles(this.app.id);
    }
    this.setTaskFiles();
  }

  ngAfterViewChecked() {
    if (this.fileTitles.length > 0 && !this.fileTitleChanged) {
      this.fileTitles._results.forEach(el => {
        if (el.nativeElement.innerText.includes('<BR/>')) {
          const texts = el.nativeElement.innerText.split('<BR/> ');
          const description = this.capitalizeFirstLetter(texts[1].toLowerCase());
          el.nativeElement.innerHTML = `${texts[0]} <p style='text-transform: none; font-family: Roboto;'>${description}</p>`;
        }
      });
      this.fileTitleChanged = true;
    }
  }

  setTaskFiles() {
    if (this.taskDecide) {
      if (this.fileCategories.length > 0) {
        this.reserveTaskDecide = this.taskService.matchingData(this.taskDecide, this.reserveTaskDecide);
        if (this.fileCategories[0].type === 'internal') {
          if (this.taskDecide.internalFiles.length > 0) {
            this.filterFileCategories(this.taskDecide.internalFiles);
          }
        }
        if (this.fileCategories[0].type === 'conclusionForZK') {
          if (this.taskDecide.zkFiles.length > 0) {
            this.filterFileCategories(this.taskDecide.zkFiles);
          }
        }
      }
    }
  }

  private initTranslate() {
    this.translate.onLangChange.pipe(takeUntil(this.destroyed$))
      .subscribe((event: any) => {
        this.currentLang = event.lang;
      });
  }

  public getAppFiles(id: number) {
    if (!(this.type && id)) {
      return;
    }
    this.api.get2(`${this.type}/${id}/files`).pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        if (res) {
          this.app.files = res;
          if (this.fileCategories) {
            this.filterFileCategories(this.app.files);
          }
        }
      });
  }

  filterFileCategories(files) {
    this.fileCategories.map((i: dic.CategoryFiles) => {
      i.categoryFiles = [];
      const fileObj = files.filter((file) => file.fileCategory === i.type);
      i.categoryFiles = fileObj ? [...i.categoryFiles, ...fileObj] : i.categoryFiles;
    });
  }

  handleFileInput(files: FileList, category: string) {
    for (let i = 0; i < files.length; i++) {
      const fileType = files.item(i).type;
      if (fileType !== 'application/pdf' && fileType !== 'image/jpeg' && fileType !== 'image/jpg') {
        this.snackBar.open(`«Формат файлов должен быть 'pdf', иные форматы не поддерживаются.
        Пожалуйста загрузите файлы в формате pdf. Если ваши файлы имеют иной формат (doc, jpg, jpeg, png и т.п.),
        то преобразуйте ваши файлы в pdf и загрузите pdf-файлы.»`, '', {duration: 6000});
        return null;
      }
    }
    if (category !== 'internal' && category !== 'conclusionForZK' && !category.includes('SPECREG')) {
      this.fileCategories.forEach((element: dic.CategoryFiles) => {
        switch (category) {
          case element.type:
            for (let i = 0; i < files.length; i++) {
              element.categoryFilesUpload.push({file: files.item(i), loading: true});
            }
            let url = `${this.type}/${this.app.id}/files`;
            this.fileSvc.saveFiles(element.categoryFilesUpload, category, url, null);
            const reqFiles = this.fileCategories.filter(file => file.type === 'RESULT_ATTACHMENT');
            if (reqFiles.length > 0) {
              localStorage.setItem('hasResultAttachmentFile', 'true');
            }
            break;
        }
      });
    } else {
      this.handleTaskFile(files, category);
    }

  }

  handleTaskFile(files: FileList, category: string) {
    for (let i = 0; i < files.length; i++) {
      if (category === 'internal') {
        this.fileSvc.getAddFileSingleReq(files.item(i), category).pipe(takeUntil(this.destroyed$))
          .subscribe((res: any) => {
            this.reserveTaskDecide.internalFiles.push({
              uid: res.uid,
              fileName: res.fileName,
              fileCategory: category,
              size: res.fileSize
            });
            this.fileCategories[0].categoryFiles = [];
            this.filterFileCategories(this.reserveTaskDecide.internalFiles);
            this.updateTask.next(this.reserveTaskDecide);
          });
      }
      if (category === 'conclusionForZK') {
        this.fileSvc.getAddFileSingleReq(files.item(i), category).pipe(takeUntil(this.destroyed$))
          .subscribe((res: any) => {
            this.reserveTaskDecide.zkFiles.push({
              uid: res.uid,
              fileName: res.fileName,
              fileCategory: category,
              size: res.fileSize,
              userId: this.currentUser.id
            });
            this.fileCategories[0].categoryFiles = [];
            this.filterFileCategories(this.reserveTaskDecide.zkFiles);
            this.updateTask.next({decide: this.reserveTaskDecide, fileCategory: category});
          });
      }
      if (category.includes('SPECREG')) {
        this.fileSvc.getAddFileSingleReq(files.item(i), category).pipe(takeUntil(this.destroyed$))
          .subscribe((res: any) => {
            this.fileCategories[0].categoryFiles.push({
              objectId: res.uid, name: res.fileName, fileCategory: category, size: res.fileSize
            });
          });
      }
    }

  }

  removeFile(file: any, category: string) {
    if (confirm(this.currentLang === 'ru' ? 'Вы точно хотите удалить этот файл?' : 'Сіз осы файлды өшіргіңіз келе ме?')) {
      if (category.includes('SPECREG')) {
        return this.removeDecreeFiles(category, file);
      }
      if (category === 'RESULT_FILE' || category === 'INTERNAL_FILES' || category.includes('TECH_CONDITION')) {
        this.changeSignData.next();
      }
      if (category === 'internal' || category === 'conclusionForZK') {
        this.removeTaskFiles(category, file);
      } else {
        this.fileSvc.getDeleteFileReq(this.type, this.app.id, file.id).pipe(takeUntil(this.destroyed$))
          .subscribe((data: any) => {
            this.removeFileByCategory(file, category);
          });
      }
    }
  }

  removeTaskFiles(category: string, removeFile: any) {
    if (category === 'internal') {
      this.reserveTaskDecide.internalFiles = this.reserveTaskDecide.internalFiles.filter((file) => {
        return file.uid !== removeFile.uid;
      });
      this.resetFileCategories();
      this.filterFileCategories(this.reserveTaskDecide.internalFiles);
      this.updateTask.next(this.reserveTaskDecide);
    }
    if (category === 'conclusionForZK') {
      if (this.currentUser.id === removeFile.userId) {
        this.reserveTaskDecide.zkFiles = this.reserveTaskDecide.zkFiles.filter((file) => {
          return file.uid !== removeFile.uid;
        });
        this.resetFileCategories();
        this.filterFileCategories(this.reserveTaskDecide.zkFiles);
        this.updateTask.next({decide: this.reserveTaskDecide, fileCategory: category});
      }
    }
  }

  removeDecreeFiles(category: string, removeFile: any) {
    /*this.fileCategories[0].categoryFiles = this.fileCategories[0].categoryFiles.filter(
      file => file.objectId !== removeFile.objectId);*/
    this.removeFileByCategory(removeFile, category);
    this.updateTask.next(removeFile);
  }

  removeFileByCategory(file: any, category: string) {
    this.fileCategories.forEach((element: dic.CategoryFiles) => {
      switch (category) {
        case element.type:
          element.categoryFiles = element.categoryFiles.filter((obj) => {
            return obj.objectId !== file.objectId;
          });
          element.categoryFilesUpload = element.categoryFilesUpload.filter((obj) => {
            return obj.objectId !== file.objectId;
          });
          break;
      }
    });
  }

  fileSizeToByte(bytes) {
    if (bytes) {
      return this.fileSvc.correctFileSize(bytes);
    }
  }

  correctFileName(str) {
    if (str) {
      return this.fileSvc.correctFileName(str);
    }
  }

  downloadAppFile(id: string) {
    this.fileSvc.downloadFileReq(id);
  }

  resetFileCategories() {
    this.fileCategories[0].categoryFiles = [];
  }

  hasCustomCategory(category: string) {
    if (category === 'internal' || category === 'CORRESPONDENCE' || category === 'ADM_DOCUMENT' || category === 'conclusionForZK') {
      return true;
    } else {
      return false;
    }
  }

  getInfoText() {
    if (this.fileCategories.length > 0) {
      let eskizFileCategories = this.fileCategories.filter(category =>
        category.type === 'ESKIZ_OTHERS' || category.type === 'ZU_PROJECT');
      return eskizFileCategories.length;
    }
  }

  capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  hasInternalFiles() {
    return this.fileCategories.some(file => file.type === 'APPLICATION_PDF');
  }

  showFileName(file) {
    if (this.hasCommunalServicesId()) {
      return true;
    }
    if (this.hideFileCat.includes(file.type) && this.checkParallelService()) {
      return false;
    }
    if (file.type !== 'ESKIZ_STAMP' && file.type !== 'ZU_PROJECT_STAMP' && file.type !== 'APPLICATION_PDF') {
      return true;
    }
  }

  showUploadBlock(file) {
    if (this.hasCommunalServicesId() && this.hasCommunalServicesRoles()) {
      return false;
    }
    if (this.hasCnRegSubservices() && file.type === 'RESULT_FILE') {
      return false;
    }
    if (this.hasCnRegSubservices() && file.type === 'RESULT_ATTACHMENT') {
      return true;
    }

    if (this.hideFileCat.includes(file.type) && this.checkParallelService()) {
      return true;
    }
    const unavailableRoles = ['RESULT_FILE', 'ESKIZ_STAMP', 'TECH_CONDITION_TEPLOSETI',
      'APPLICATION_PDF', 'ZU_PROJECT_STAMP', 'TECH_CONDITION_JARYK', 'TECH_CONDITION_SUARNASY'];
    if (unavailableRoles.some(type => type === file.type)) {
      return true;
    }
  }

  hasCnRegSubservices() {
    if (this.app && this.app.subservice.id) {
      const availableIds = [58, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89];
      return availableIds.some(role => role === this.app.subservice.id);
    }
  }

  hasCommunalServicesId() {
    if (this.taskDecide) {
      const availableIds = [105, 122, 121, 125, 90, 31, 32];
      return availableIds.some(role => role === this.taskDecide.subserviceId);
    }
  }

  hasCommunalServicesRoles() {
    if (this.taskDecide && this.taskDecide.role) {
      const availableIds = ['TUGAS_REG_EXECUTOR', 'TUJARYK_EXECUTOR2', 'TUJARYK_KANC', 'SU_KANC', 'SU_HEAD', 'TU_SUARNASY_EXECUTOR',
      'JARYK_KANC', 'JARYK_EXECUTOR'];
      return availableIds.some(role => role === this.taskDecide.role);
    }
  }

  checkParallelService() {
    return this.app && [107, 130, 131, 132, 152].includes(this.app.subservice.id);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

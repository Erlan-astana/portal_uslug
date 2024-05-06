import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {DicApplicationService} from '../../../services/dic.application.service';
import {MatSnackBar, Sort} from '@angular/material';
import {ApiService} from '../../../services/api.service';
import {dic} from '../../../shared/models/dictionary.model';
import {TranslateService} from '@ngx-translate/core';
import {ProblemService} from '../../../services/problem.service';
import {FileService} from '../../../services/file.service';
import {EditorService} from '../../../services/editor.service';
import {Subject} from 'rxjs';
import {AdminService} from '../../../services/admin.service';
import {takeUntil} from "rxjs/operators";
import TemplateEditor = dic.TemplateEditor;


export interface TemplateDate {
  from: string;
  to: string;
}

@Component({
  selector: 'app-template-editor',
  templateUrl: './template-editor.component.html',
  styleUrls: ['./template-editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TemplateEditorComponent implements OnInit {
  tempData: TemplateDate[] = [
    {from: 'Адрес заявителя', to: 'address'},
    {from: 'ФИО заявителя', to: 'fullName'},
    {from: 'Наименование юр лица', to: 'nameOfLegalEntity'},
    {from: 'Наименование юр лица || ФИО заявителя', to: 'appNameOrOrgName'},
    {from: 'Регистрационный номер заявления', to: 'regNum'},
    {from: 'Регистрационная дата заявления', to: 'regDate'},
    {from: 'Исходящий номер', to: 'outgoingNum'},
    {from: 'Исходящая дата', to: 'outgoingDate'},
    {from: 'Адрес объекта', to: 'objAddress'},
    {from: 'Наименование объекта', to: 'objName'},
    {from: 'Площадь участка', to: 'objArea'},
    {from: 'ИИН', to: 'IINApplicant'},
    {from: 'БИН', to: 'BINApplicant'},
    {from: 'Право пользования ЗУ', to: 'rightToUseZU'},
    {from: 'Площадь, га', to: 'areaGA'},
    {from: 'Целевое назначение (текущее)', to: 'specialPurposeCurrent'},
    {from: 'Целевое назначение (запрашиваемое)', to: 'specialPurposeReq'},
    {from: 'Причина необходимости изменения целевого назначения', to: 'reasonForChangingPurpose'},
    {from: 'Кадастровый номер', to: 'cadastreNumber'},
    {from: 'Номер протокола земельной коммиссии', to: 'protocolNumber'},
    {from: 'Дата протокола земельной коммисси', to: 'protocolDate'}
  ];
  sortedData: TemplateDate[];
  templateData: dic.TemplateEditor = new dic.TemplateEditor();
  orgTemplates: any;
  services: any;
  servicesCopy: any;
  selectedServiceId: any = 21;
  currentLang;
  hasTemplate = false;
  destroyed$ = new Subject();
  selectedRegionId: number;

  constructor(
    private dicSvc: DicApplicationService,
    private api: ApiService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private taskSvc: ProblemService,
    private fileSvc: FileService,
    private editorSvc: EditorService,
    private adminService: AdminService
  ) {
    this.sortedData = this.tempData.slice();
    this.currentLang = this.translate.currentLang ? this.translate.currentLang : this.translate.getDefaultLang();
  }

  ngOnInit() {
    this.translate.onLangChange.pipe(takeUntil(this.destroyed$))
      .subscribe((event: any) => {
        this.currentLang = event.lang;
      });
    this.getSubservices();
  }

  getSubservices() {
    this.dicSvc.getAllSubServiceReq().pipe(takeUntil(this.destroyed$))
      .subscribe((data: any) => {
        data.forEach(service => {
          service.shortNameRu = service.shortNameRu ? service.shortNameRu : service.nameRu;
        });
        this.services = data;
        this.servicesCopy = this.services;
      });
  }

  sortData(sort: Sort) {
    const data = this.tempData.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'from':
          return compare(a.from, b.from, isAsc);
        case 'to':
          return compare(a.to, b.to, isAsc);
        default:
          return 0;
      }
    });
  }

  addNewTemplate() {
    this.hasTemplate = true;
  }

  prepareData() {
    this.templateData.subserviceId = parseInt(this.selectedServiceId);
    this.templateData.text = this.closeTagImg(this.templateData.text);
    this.setRegionToTemplateData();
    if (this.selectedRegionId) {
      if (this.templateData.id) {
        this.updateTemplate();
      } else {
        this.save();
      }
    }
  }

  public setRegionToTemplateData() {
    if (this.selectedRegionId) {
      this.templateData.regionId = this.selectedRegionId;
    } else {
      this.snackBar.open('Выберите регион', '', {duration: 3000});
    }
  }

  save() {
    this.api.post2('templates', this.templateData).pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        this.snackBar.open('Шаблон успешно создан', '', {duration: 3000});
        this.getTemplates(this.selectedServiceId);
        this.cancel();
        this.hasTemplate = false;
      });
  }

  updateTemplate() {
    this.api.put2('templates', this.templateData).pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        if (res) {
          this.snackBar.open('Шаблон успешно обновлен', '', {duration: 3000});
          this.getTemplates(this.selectedServiceId);
          this.cancel();
        }
      });
  }

  getTemplates(selectedServiceId): void {
    if (selectedServiceId && this.selectedRegionId) {
      this.cancel();
      const url = `templates?subserviceId=${selectedServiceId}&regionId=${this.selectedRegionId}`;
      this.api.get2(url).pipe(takeUntil(this.destroyed$))
        .subscribe((data: any) => {
          this.orgTemplates = data;
          this.selectedServiceId = selectedServiceId;
        });
    }
  }

  setTemplate(template: TemplateEditor) {
    this.templateData = template;
    this.editorSvc.sendMessage(template.text);
    this.hasTemplate = true;
  }

  cancel() {
    this.templateData = new dic.TemplateEditor();
    this.editorSvc.sendMessage('');
    this.hasTemplate = false;
  }

  previewPdf() {
    if (this.templateData.text) {
      let text = this.closeTagImg(this.templateData.text);
      let body: any = {};
      body.message = text;
      this.fileSvc.generatePdfFromContent(body);
    }
  }

  closeTagImg(text) {
    return this.editorSvc.textRenderAndCorrection(text);
  }

  removeTemplate(template) {
    if (confirm(this.currentLang === 'ru' ? `Удалить шаблон '${template.nameRu}?'` : `Сіз осы шаблонды өшіргіңіз келе ме? '${template.nameKk}'`)) {
      this.api.delete(`templates/${template.id}`).pipe(takeUntil(this.destroyed$))
        .subscribe(res => {
          if (res) {
            this.snackBar.open('Шаблон успешно удален', '', {duration: 3000});
            this.getTemplates(this.selectedServiceId);
            this.cancel();
          }
        });
    }
  }

  public setText(text) {
    this.templateData.text = text;
  }

  searchByServices(query: string) {
    const result = this.adminService.optionSelect(query, this.services, 'shortNameRu');
    this.servicesCopy = result;
  }

  setSelectedRegionId(id) {
    this.selectedRegionId = id;
    this.getTemplates(this.selectedServiceId);
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}



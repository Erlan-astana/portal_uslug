import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {dic} from '../shared/models/dictionary.model';
import {Observable, Subject} from 'rxjs';
import {FileService} from './file.service';
import {app} from '../shared/models/application.model';
import Decide = dic.Decide;
import { auth } from '../shared/models/auth.model';
import App = app.App;
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProblemService {
  private menuSubject = new Subject<any>();
  private currentTask = new dic.TaskData();
  private taskDecideSubject = new Subject();
  private hasHead = new Subject();
  private taskSubject = new Subject();
  private approvalList = new Subject();
  public currentPage: number;
  private application: any;
  orderTextReserve: string;
  intgnObj: any;


  constructor(private api: ApiService,
              private fileSvc: FileService,
              private authService: AuthService) {
  }

  sendApprovalList(list: any) {
    this.approvalList.next(list);
  }

  getApprovalList(): Observable<any> {
    return this.approvalList.asObservable();
  }

  sendTaskSubject(task: any) {
    this.taskSubject.next(task);
  }

  getTaskSubject(): Observable<any> {
    return this.taskSubject.asObservable();
  }

  sendTaskDecideSubject(decide: any) {
    this.taskDecideSubject.next(decide);
  }

  getTaskDecideSubject(): Observable<any> {
    return this.taskDecideSubject.asObservable();
  }

  sendHeadSubject(head: any) {
    this.hasHead.next(head);
  }

  getHeadSubject(): Observable<any> {
    return this.hasHead.asObservable();
  }

  getSidenavMenuCounts() {
    this.api.get2('analytics/menu').subscribe(res => {
      this.sendMenu(res);
    }, error => {
      this.sendMenu(null);
    });
  }

  sendMenu(menu: any): void {
    this.menuSubject.next({data: menu});
  }

  clearMenu(): void {
    this.menuSubject.next();
  }

  getMenu(): Observable<any> {
    return this.menuSubject.asObservable();
  }

  public setTask(task: any) {
    this.currentTask = task;
  }

  public getTask() {
    return this.currentTask;
  }

  public checkHasService(service: string, taskName) {
    if (taskName) {
      if (taskName.indexOf(service) !== -1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  public checkCodeMatch(formCode, taskCode) {
    const result = formCode === taskCode ? true : false;
    return result;
  }

  public checkTaskRolesForChanceryAkim(taskRole) {
    const availableRoles = ['CN_OZO_EXECUTOR_REG', 'CN_REG_EXECUTOR2', 'CNREG_EXECUTOR2', 'UZP_OZO_POST', 'IZYSKATREG_EXECUTOR',
      'IZYSKATELNYI_EXECUTOR2', 'IZYSKATREG_UZO_EXECUTOR'];
    return this.checkRoles(taskRole, availableRoles);
  }

  public checkTaskRolesForRegisterDecree(taskRole) {
    const availableRoles = ['ADRPRISV_EXECUTOR', 'DEMOLITION_APPARAT', 'REKULTIVACIA_KANC', 'DELIMOST_CANC'];
    return this.checkRoles(taskRole, availableRoles);
  }

  checkRoles(taskRole, roles) {
    return roles.some(role => role === taskRole);
  }


  public getMyExecutedTasks(page: number, size: number, body) {
    return this.api.post2(`history/tasks/filter?page=${page}&size=${size}`, body);
  }

  public getMySentTasks(email: string, page: number, size: number) {
    return this.api.get2(`userapp?signed=true&page=${page}&size=${size}`);
  }

  public getTaskById(id: any) {
    return this.api.get2(`tasks/${id}`);
  }

  public decide(taskId, data: Decide, paramData: string = '') {
    const params = paramData ? `?${paramData}` : '';
    return this.api.post2(`tasks/${taskId}/complete` + params, data);
  }

  public getTasks(page: number, size: number, body, sort: string = null) {
    return this.api.post2(`tasks/filter?page=${page}&size=${size}&sort=${sort}`, body);
  }

  public getOperationTasks(page: number, size: number, body, sort: string = null) {
    return this.api.post2(`history/tasks/filter?page=${page}&size=${size}&sort=${sort}`, body);
  }

  public getMyTasks(page: number, size: number, body, sort: string = null) {
    return this.api.post2(`tasks/filter?page=${page}&size=${size}&sort=${sort}`, body);
  }

  public refreshTask(id: number, data: any) {
    return this.api.put2(`executions/${id}`, data);
  }

  public getHistory(id, subserviceId) {
    return this.api.get2(`history/userapp/${id}?subserviceId=${subserviceId}`);
  }

  public getHistoryById(id) {
    return this.api.get2(`history/tasks/${id}`);
  }

  public getUnusualDays(startDate, endDate) {
    return this.api.get(`dict/days/period?startDate=${startDate}&endDate=${endDate}`);
  }

  public getSpecregByAppId(appId) {
    return this.api.get2(`specreg/app/${appId}`);
  }

  public createSpecregByAppId(appId, regionId) {
    return this.api.post2(`specreg/app/${appId}/create/${regionId}`);
  }

  public getTaskVariablesById(id) {
    return this.api.get2(`history/tasks/${id}/variables`);
  }

  public saveUzpFile(appId) {
    return this.api.post2(`userapp/${appId}/save/uzp`);
  }

  public getUzpFile(appId) {
    return this.api.postArrayBuffer(`userapp/${appId}/preview/uzp`);
  }

  public generatePdf(id) {
    return this.api.getArrayBuffer(`userapp/${id}/preview`).subscribe(res => {
      this.fileSvc.downloadGeneratedFile(res, 'preview.pdf');
    });
  }

  public matchingData(content, dataTaskDeside) {
    const desideColumns = Object.getOwnPropertyNames(dataTaskDeside);
    desideColumns.forEach(column => {
      if (column === 'internalFiles' || column === 'files') {
        dataTaskDeside[column] = content[column] ? content[column] : [];
      } else {
        if (content[column] || content[column] === 0) {
          dataTaskDeside[column] = content[column];
        }
      }
    });
    return dataTaskDeside;
  }

  public extractContent(s) {
    let span = document.createElement('span');
    span.innerHTML = s;
    return span.textContent || span.innerText;
  }

  public getTemplatesBySubServiceId(id, regionId) {
    return this.api.get2(`templates?subserviceId=${id}&regionId=${regionId}`);
  }

  public hasText(str, value) {
    const result = str.indexOf(value) === -1 ? false : true;
    return result;
  }

  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  public removeTask(processInstanceId, appId) {
    return this.api.delete(`executions/${processInstanceId}?appId=${appId}`);
  }

  restartTask(processInstanceId, appId) {
    return this.api.post2(`executions/${processInstanceId}/restart?appId=${appId}`);
  }

  saveSpecreg(body) {
    return this.api.post2(`specreg`, body);
  }

  updateSpecreg(body) {
    return this.api.put2(`specreg`, body);
  }


  replaceTemplateTexts(text, app: app.App, dataTaskDecide?, currentUser?) {
    const re = /(<figure>(?:[^<](?!\/figure))*<\/figure>)|(fio)/gi;

    this.application = app;

    /*if (this.hasText(text, 'fullName')) {
      var self = this;
      text = text.replace(re, function fnCallback(s) {
        if (s === 'fullName') {
          return `${self.application.firstName} ${self.application.secondName} ${self.application.lastName}`;
        }
        return s;
      });
    }*/
    if (this.hasText(text, 'fullName')) {
      const fullName = `${app.firstName} ${app.secondName} ${app.lastName}`;
      text = text.replace(/fullName/gi, fullName);
    }
    if (this.hasText(text, 'regNum')) {
      text = text.replace(/regNum/gi, app.idx);
    }
    if (this.hasText(text, 'nameOfLegalEntity')) {
      text = text.replace(/nameOfLegalEntity/gi, app.orgName);
    }
    if (this.hasText(text, 'appNameOrOrgName')) {
      text = text.replace(/appNameOrOrgName/gi, this.getAppNameOrOrgName(app));
    }
    if (this.hasText(text, 'regDate')) {
      text = text.replace(/regDate/gi, new Date(app.createDate).toLocaleDateString('ru-Ru'));
    }
    if (this.hasText(text, 'objAddress')) {
      text = text.replace(/objAddress/gi, app.objectInfo.address);
    }
    if (this.hasText(text, 'address')) {
      app.address = app.address.replace('Казахстан,', 'Казахстан, </br>');
      text = text.replace(/address/gi, app.address);
    }
    if (this.hasText(text, 'objName')) {
      text = text.replace(/objName/gi, app.objectInfo.name);
    }
    if (this.hasText(text, 'objArea')) {
      text = text.replace(/objArea/gi, app.objectInfo.area);
    }
    if (this.hasText(text, 'IINApplicant') && !app.bin) {
      text = text.replace(/IINApplicant/gi, app.iin);
    } else {
      text = text.replace(/IINApplicant/gi, '');
    }
    if (this.hasText(text, 'BINApplicant') && app.bin) {
      text = text.replace(/BINApplicant/gi, app.bin);
    } else {
      text = text.replace(/BINApplicant/gi, '');
    }
    if (this.hasText(text, 'rightToUseZU')) {
      text = text.replace(/rightToUseZU/gi, app.objectInfo.useRight);
    }
    if (this.hasText(text, 'areaGA')) {
      text = text.replace(/areaGA/gi, app.objectInfo.area);
    }
    if (this.hasText(text, 'specialPurposeCurrent')) {
      text = text.replace(/specialPurposeCurrent/gi, app.objectInfo.purpose);
    }
    if (this.hasText(text, 'specialPurposeReq')) {
      text = text.replace(/specialPurposeReq/gi, app.objectInfo.purposeRequested);
    }
    if (this.hasText(text, 'reasonForChangingPurpose')) {
      text = text.replace(/reasonForChangingPurpose/gi, app.objectInfo.changeReason);
    }
    if (this.hasText(text, 'cadastreNumber')) {
      text = text.replace(/cadastreNumber/gi, app.objectInfo.cadastreNumber);
    }
    if (this.hasText(text, 'outgoingNum')) {
      text = text.replace(/outgoingNum/gi, app.appId);
    }
    if (this.hasText(text, 'outgoingDate')) {
      text = text.replace(/outgoingDate/gi, new Date(app.createDate).toLocaleDateString('ru-Ru'));
    }
    if (this.hasText(text, 'protocolNumber') && app.landInfo) {
      text = text.replace(/protocolNumber/gi, app.landInfo.protocolNumber);
    }
    if (this.hasText(text, 'protocolDate') && app.landInfo) {
      text = text.replace(/protocolDate/gi, new Date(app.landInfo.protocolDate).toLocaleDateString('ru-Ru'));
    }
    if (this.hasText(text, 'currentDate')) {
      text = text.replace(/currentDate/gi, new Date().toLocaleDateString('ru-Ru'));
    }
    if (this.hasText(text, 'currentUserName') && currentUser) {
      text = text.replace(/currentUserName/gi, (currentUser.lastName + ' ' + currentUser.firstName));
    }
    if (this.hasText(text, 'communalStatus') && dataTaskDecide) {
      text = text.replace(/communalStatus/gi, dataTaskDecide.communalStatus);
    }
    if (this.hasText(text, 'communalResults') && dataTaskDecide) {
      text = text.replace(/communalResults/gi, dataTaskDecide.communalResults);
    }
    return text;
  }

  private getAppNameOrOrgName(application: app.App) {
    const result = application.bin ? application.orgName : `${application.firstName} ${application.secondName} ${application.lastName}`;
    return result;
  }

  setOrderText(orderText) {
    if (orderText) {
      this.orderTextReserve = orderText;
    }
  }

  getOrderTextDifference(orderText) {
    if (!this.orderTextReserve) {
      return orderText;
    } else {
      const re = /<[^>]*>|(&nbsp;)/gi;
      const orderTextArr = orderText.replace(re, ' ').split(' ').filter(str => str !== '');
      const orderTextReserveArr = this.orderTextReserve.replace(re, ' ').split(' ').filter(str => str !== '');
      const newWords = orderTextArr.filter(str => {
        if (!orderTextReserveArr.includes(str)) {
          return str;
        } else {
          const strIndex = orderTextReserveArr.indexOf(str);
          orderTextReserveArr.splice(strIndex, 1);
        }
      });
      if (newWords.length > 0) {
        return newWords.join('; ');
      }
    }
  }

  getCurrentPage() {
    return this.currentPage;
  }

  setCurrentPage(page) {
    this.currentPage = page;
  }

  public removeUnnecessaryFieldsFromDecide(decide: Decide) {
    delete decide.executor;
    delete decide.executorName;
    delete decide.owner;
    return decide;
  }

  public async getExecutors(task) {
    const rolesEditorIsAvailable = [30, 41, 39, 40, 42, 5];
    let users = [];
    rolesEditorIsAvailable.map(roleId => {
      this.authService.getUsersByRole(roleId, task.content.subserviceId).subscribe((res: any) => {
        if (res.length > 0) {
          users = users.concat(res);
          this.preparingUsersForEditor(users);
        }
      });
    });

  }


  preparingUsersForEditor(users) {
    const uniqueUsers = users.filter((value, index, self) => self.findIndex(t => (t.id === value.id)) === index);

    const correctUsers = uniqueUsers.map(user => {
      const newUser: any = {};
      newUser.id = `user-${user.username}`;
      newUser.name = `${user.username}`;
      return newUser;
    });

    localStorage.setItem('ozoExecutorsForEditor', JSON.stringify(correctUsers));
  }

  getServicePosition(task) {
    return parseInt(task.name);
  }

  getAssignees(taskId: number, data: Decide) {
    return this.api.post2(`tasks/${taskId}/next/assignees`, data);
  }

  communalFileCategory(orgCode) {
    switch (orgCode) {
      case 'gas': return 'TECH_CONDITION_GAS';
      case 'TazaSu': return 'TECH_CONDITION_WATER';
      case 'KulanEnergoJylu': return 'TECH_CONDITION_TEPLO';
      case 'energo': return 'TECH_CONDITION_ENERGO';
      case 'kazahtelecom': return 'TECH_CONDITION_KAZAHTELECOM';
      case 'transtelecom': return 'TECH_CONDITION_TRANSTELECOM';
      case 'ozo': return 'TECH_CONDITION_OZO';
      case 'BaizakSu': return 'TECH_CONDITION_BAIZAKSU';
      case 'Igilik': return 'TECH_CONDITION_IGILIK';
      case 'KordaiSu': return 'TECH_CONDITION_KORDAISU';
      case 'AksuKordai': return 'TECH_CONDITION_AKSUKORDAI';
      case 'JanatasSuJylu': return 'TECH_CONDITION_JANATASSUJYLU';
      case 'MerkeSu': return 'TECH_CONDITION_MERKISU';
      case 'energo_zhes': return 'TECH_CONDITION_ZHES';
      case 'water_zhambyl_su': return 'TECH_CONDITION_ZHAMBYL_SU';
      case 'teplo_zhambyl_zhylu': return 'TECH_CONDITION_ZHAMBYL_ZHYLU';
      default: return null;
    }
  }

  getIntgnInfo(appId: number) {
    return this.api.get2(`userapp/${appId}/integrationInfo`);
  }

  sendActApplicant(appId: number) {
    return this.api.POST_INTGN_API(`test/RgisUniversal/response1/${appId}`, {});
  }

  setIntgnObj(app: App, authUser: auth.User, intgnInfo?: dic.IntegrationInfo) {
    return this.intgnObj = {
      appId: app.id,
      zuId: app.zuId,
      area: app.objectInfo.area,
      serviceType: app.subservice.id,
      actDate: new Date(),
      files: null,
      funcUse: app.objectInfo.funcUse ? app.objectInfo.funcUse : {id : '7020100000', nameRus : '', nameKaz : ''},
      purposeUse: app.objectInfo.purposeUse ? app.objectInfo.purposeUse : {id : '37', nameRus : '', nameKaz : ''},
      rightType: app.objectInfo.rightType ? app.objectInfo.rightType : {id : '01', code: 'test', nameRus : 'test', nameKaz : 'test'},
      ownershipForm: app.objectInfo.ownershipForm ? app.objectInfo.ownershipForm : {id : '', nameRus : '', nameKaz : ''},
      landCategory: app.objectInfo.landCategory ? app.objectInfo.landCategory : {id : 'landcat_znp', nameRus : '', nameKaz : ''},
      techConditions: {
        elektrPower: app.electricInfo.requiredPower,
        elektrFaza1: app.electricInfo.onePhaseElecSem,
        elektrFaza3: app.electricInfo.threePhaseElecSem,
        waterPower: app.waterInfo.power,
        waterHoz: app.waterInfo.hoz,
        waterProduction: app.waterInfo.production,
        seweragePower: app.sewerageInfo.power,
        sewerageClean: app.sewerageInfo.clean,
        sewerageFecal: app.sewerageInfo.fecal,
        sewerageProduction: app.sewerageInfo.production,
        centralSewerary: app.sewerageInfo.centralSewerage,
        heatFiring: app.heatInfo.firing,
        heatPower: app.heatInfo.power,
        heatHotWater: app.heatInfo.hotWater,
        heatVentilation: app.heatInfo.ventilation,
        telekom: '',
        gasPower: app.gasInfo.power,
        gasConditioning: app.gasInfo.conditioning,
        gasHeating: app.gasInfo.heating,
        gasHotWater: app.gasInfo.hotWater,
        gasOnCooking: app.gasInfo.cooking,
        gasVentilation: app.gasInfo.ventilation,
        stormWater: app.auctionInfo ? app.auctionInfo.stormWater : ''
      },
      userInfo: {
        iinBin: app.bin ? app.bin : app.iin,
        lastName: app.lastName,
        firstName: app.firstName,
        secondName: app.secondName,
        phone: app.phone
      },
      coordinates: app.objectInfo.locationWkt,
      coordinateSystem: '',
      ateCode: '168533',
      chainId: intgnInfo.systemInfoChainId,
      requestNumber: intgnInfo.systemInfoRequestNumber
    };
  }

  sendEgkn(app: App, authUser: auth.User, intgnInfo: dic.IntegrationInfo) {
    return this.api.POST_INTGN_API(`egkn/send_egkn`, this.setIntgnObj(app, authUser, intgnInfo));
  }

  sendEgknMio(app: App, authUser: auth.User, intgnInfo: dic.IntegrationInfo) {
    this.setIntgnObj(app, authUser, intgnInfo);
    this.intgnObj.attachment = {
      codeType: 'ZKR12',
      fileName: 'Решение МИО (Постановление)',
      fileId: '00000000-0000-f53e-b273-4d35310fa365',
      docNumber: '12',
      docDate: '2020-12-15'
    };
    this.intgnObj.requestNumber = intgnInfo.requestNumber || 1;
    this.intgnObj.chainId = intgnInfo.systemInfoChainId;
    this.intgnObj.actNumber = 12;
    this.intgnObj.techConditionsEndAuctionType = {
      elektrPower: app.electricInfo.requiredPower,
      elektrFaza1: app.electricInfo.onePhaseElecSem,
      elektrFaza3: app.electricInfo.threePhaseElecSem,
      waterPower: app.waterInfo.power,
      waterHoz: app.waterInfo.hoz,
      waterProduction: app.waterInfo.production,
      seweragePower: app.sewerageInfo.power,
      sewerageClean: app.sewerageInfo.clean,
      sewerageFecal: app.sewerageInfo.fecal,
      sewerageProduction: app.sewerageInfo.production,
      stormWater: app.auctionInfo ? app.auctionInfo.stormWater : '',
      centralSewerary: app.sewerageInfo.centralSewerage,
      heatFiring: app.heatInfo.firing,
      heatPower: app.heatInfo.power,
      heatHotWater: app.heatInfo.hotWater,
      heatVentilation: app.heatInfo.ventilation,
      telekom: '',
      gasPower: app.gasInfo.power,
      gasConditioning: app.gasInfo.conditioning,
      gasHeating: app.gasInfo.heating,
      gasOnCooking: app.gasInfo.cooking,
      gasVentilation: app.gasInfo.ventilation,
      gasHotWater: app.gasInfo.hotWater,
    };
    this.intgnObj.divisible = app.landInfo ? app.landInfo.divisible : true;
    this.intgnObj.landSelectionStatus = null;
    if (!app.addressInfo) {
      this.intgnObj.addressInfo = {};
    } else {
      this.intgnObj.addressInfo = {
        id: app.addressInfo ? app.addressInfo.id : '',
        ateCode: app.addressInfo ? app.addressInfo.ateCode : '',
        parentAteCode: app.addressInfo ? app.addressInfo.parentAteCode : '',
        ateTypeCode: app.addressInfo ? app.addressInfo.ateTypeCode : '',
        ateNameRu: app.addressInfo.ateNameRu,
        ateNameKk: app.addressInfo.ateNameKk,
        toponimCode: app.addressInfo.toponimCode,
        toponimTypeCode: app.addressInfo.toponimTypeCode,
        toponimNameRu: app.addressInfo.toponimNameRu,
        toponimNameKk: app.addressInfo.toponimNameKk,
        rca: app.addressInfo.rca,
        buildingTypeCode: app.addressInfo.buildingTypeCode,
        buildingNumber: app.addressInfo.buildingNumber,
        buildingPartRca: app.addressInfo.buildingPartRca,
        buildingPartTypeCode: app.addressInfo.buildingPartTypeCode,
        buildingRca: app.addressInfo.buildingRca,
        buildingPartNumber: app.addressInfo.buildingPartNumber,
        addressCode: app.addressInfo.addressCode,
        objectType: app.addressInfo.objectType,
        addressNameRu: app.addressInfo.addressNameRu,
        addressNameKk: app.addressInfo.addressNameKk,
      };
    }
    return this.api.POST_INTGN_API(`egkn/send_egkn_mio`, this.intgnObj);
  }

  sendAuctionData(data: any ) {
    return this.api.POST_INTGN_API(`egkn/send_auction`, data);
  }

}



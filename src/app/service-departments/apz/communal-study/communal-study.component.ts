import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BaseSpecialistComponent} from '../../../departments/architecture/base-specialist/base-specialist.component';
import {ActivatedRoute} from '@angular/router';
import {ProblemService} from '../../../services/problem.service';
import {ApplicationService} from '../../../services/application.service';
import {AuthService} from '../../../services/auth.service';
import {TranslateService} from '@ngx-translate/core';
import {EditorService} from '../../../services/editor.service';
import {FileService} from '../../../services/file.service';
import {dic} from '../../../shared/models/dictionary.model';
import {Subscription} from 'rxjs';
import {utilcompany} from '../../../shared/models/utility-company.model';
import {CommunalMapComponent} from '../communal-map/communal-map.component';
import * as L from 'leaflet';
import domtoimage from 'dom-to-image';
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-communal-study',
  templateUrl: './communal-study.component.html',
  styleUrls: ['./communal-study.component.scss']
})
export class CommunalStudyComponent extends BaseSpecialistComponent implements OnInit, OnDestroy {
  communalFileCategories: any[] = [
    {
      extensions: 'application/pdf',
      id: 32,
      ids: [32, 90],
      required: true,
      subserviceId: 32,
      title: 'Документы на выдачу Заявителю',
      titleKk: 'Шағымданушыға берілетін құжаттар',
      titleRu: 'Документы на выдачу Заявителю',
      type: 'TECH_CONDITION_JARYK',
      categoryFiles: [],
      categoryFilesUpload: [],
      display: false
    },
    {
      extensions: 'application/pdf',
      ids: [31, 122, 121, 125],
      required: true,
      subserviceId: 31,
      title: 'Документы на выдачу Заявителю',
      titleKk: 'Шағымданушыға берілетін құжаттар',
      titleRu: 'Документы на выдачу Заявителю',
      type: 'TECH_CONDITION_SUARNASY',
      categoryFiles: [],
      categoryFilesUpload: [],
      display: false
    },
    {
      extensions: 'application/pdf',
      ids: [35],
      required: true,
      subserviceId: 35,
      title: 'Документы на выдачу Заявителю',
      titleKk: 'Шағымданушыға берілетін құжаттар',
      titleRu: 'Документы на выдачу Заявителю',
      type: 'TECH_CONDITION_TEPLOSETI',
      categoryFiles: [],
      categoryFilesUpload: [],
      display: false
    },
    {
      extensions: 'application/pdf',
      ids: [38, 105],
      required: true,
      subserviceId: 38,
      title: 'Документы на выдачу Заявителю',
      titleKk: 'Шағымданушыға берілетін құжаттар',
      titleRu: 'Документы на выдачу Заявителю',
      type: 'TECH_CONDITION_GAS',
      categoryFiles: [],
      categoryFilesUpload: [],
      display: false
    },
  ];
  @ViewChild(CommunalMapComponent, {static: false})
  public communalMap: CommunalMapComponent;
  taskSubscription: Subscription;
  orgApp: utilcompany.UtilCompanyApp = new utilcompany.UtilCompanyApp();
  mapImageInFormatBase64: any;

  constructor(
    public route: ActivatedRoute,
    public taskService: ProblemService,
    public appSvc: ApplicationService,
    public authService: AuthService,
    public translate: TranslateService,
    public editorSvc: EditorService,
    public fileSvc: FileService,
  ) {
    super(route, taskService, appSvc, authService, translate, editorSvc, fileSvc);
    this.taskSubscription = this.taskService.getTaskSubject()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(task => {
        this.filterFileCategoriesBySubserviceId(this.task.content.subserviceId);
        this.getAppOrg();
      });
  }

  ngOnInit() {
    super.ngOnInit();
  }

  getAppOrg() {
    if (this.authService.currentOurUser && this.authService.currentOurUser.organization) {
      this.appSvc.getAppOrg(this.task.content.appId, this.authService.currentOurUser.organization.id ||
        this.currentUser.organization.id)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(res => {
          this.orgApp = res;
        });
    }

  }

  setParentTaskDecide() {
    this.taskService.sendTaskDecideSubject(this.dataTaskDecide);
  }

  communalChangeSignData() {
    this.dataTaskDecide.communalSigned = false;
    this.updateTask();
  }

  filterFileCategoriesBySubserviceId(subserviceId) {
    this.communalFileCategories = this.communalFileCategories.filter(cat => cat.ids.some(id => id === subserviceId));
  }

  saveConnections() {
    const connections = this.setConnectionPoints();
    if (connections.length > 0) {
      this.appSvc.saveAppOrgConnections(this.orgApp.id, connections)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(res => {
          console.log(res);
        });
    }
  }

  setConnectionPoints() {
    const arr = [];
    if (this.communalMap && this.communalMap.map) {
      this.communalMap.map.eachLayer((layer) => {
        // @ts-ignore
        if (layer.objectType === 'circlemarker') {
          if (layer instanceof L.CircleMarker) {
            const geojson = layer.toGeoJSON();
            const obj = {
              appOrgId: this.orgApp.id,
              // @ts-ignore
              data: layer.textContent,
              connection: JSON.stringify(geojson),
            };
            // @ts-ignore;
            const layerId = layer.id;
            if (layerId) {
              const connection = this.communalMap.connectionPointLayer.find(i => i.id === layerId);
              if (connection !== undefined) {
                obj['id'] = layerId;
              }
            }
            arr.push(obj);
          }
        }
      });
    }
    return arr;
  }

  getMapImgInFormatBase64() {
    this.hideControls(true);
    const mapContainer = document.getElementById('uappcardmapid');

    domtoimage.toPng(mapContainer, {height: 400, width: 600}).then(dataUrl => {
      console.log(dataUrl);
      this.mapImageInFormatBase64 = dataUrl;
      const mapImage = `<figure class="image"><img src="${this.mapImageInFormatBase64}"></figure>`;
      this.setText(this.dataTaskDecide.message + mapImage);
      this.editorSvc.sendMessage(this.dataTaskDecide.message);

      this.hideControls(false);
    });
  }

  hideControls(hide: boolean) {
    const controls = document.getElementsByClassName('leaflet-control');
    for (let i = 0; i < controls.length; i++) {
      const item: any = controls[i];
      item.style.display = hide ? 'none' : 'block';
    }
  }

  showEditorTemplatesByRole(taskRole) {
    if (taskRole) {
      const unavailableRoles = ['RESOLUTION_TEPLO', 'TU_GAS_EXECUTOR', 'TU_GAS_SERVICE_HEAD', 'RESOLUTION_TEPLO', 'TUJARYK_EXECUTOR2',
        'TUGAS_REG_EXECUTOR', 'SU_KANC', 'SU_HEAD', 'JARYK_KANC', 'JARYK_EXECUTOR'];
      const result = unavailableRoles.some(role => role === taskRole);
      return !result;
    }
  }

  showTemplatesByRole(taskRole) {
    if (taskRole) {
      const unavailableRoles = ['TU_GAS_EXECUTOR', 'TUJARYK_EXECUTOR2', 'RESOLUTION_TEPLO', 'TUJARYK_KANC', 'TUGAS_REG_EXECUTOR',
        'SU_KANC', 'JARYK_KANC', 'JARYK_EXECUTOR'];
      const result = unavailableRoles.some(role => role === taskRole);
      return !result;
    }
  }

  hasRecomendation() {
    if (this.dataTaskDecide.subserviceId) {
      const availableIds = [];
      return availableIds.some(role => role === this.dataTaskDecide.subserviceId);
    }
  }

  editInAvailableRoles(taskRole) {
    const availableRoles = ['JARYK_RECOM', 'JARYK_RECOM_HEAD',];
    return availableRoles.some(role => role === taskRole);
  }


  ngOnDestroy(): void {
    this.taskSubscription.unsubscribe();
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

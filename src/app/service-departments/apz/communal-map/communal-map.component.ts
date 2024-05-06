import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, Renderer2} from '@angular/core';
import {MapService} from '../../../services/map.service';
import {GeomService} from '../../../services/geom.service';
import {MapControlsService} from '../../../services/map.controls.service';
import {AuthService} from '../../../services/auth.service';
import {ApiService} from '../../../services/api.service';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {mapmodel} from '../../../shared/models/map.model';
import {MessageBoxComponent} from '../../../components/message-box/message-box.component';
import {auth} from '../../../shared/models/auth.model';
import {app} from '../../../shared/models/application.model';
import {utilcompany} from '../../../shared/models/utility-company.model';
import {IdentifyService} from '../../../services/identify.service';
import * as L from 'leaflet';
import {ROLES} from "../../../shared/utils/constants";

export interface CommunalConnections {
  id: number;
  appOrgId: number;
  connection: string;
  data: string;
}


@Component({
  selector: 'app-communal-map',
  templateUrl: './communal-map.component.html',
  styleUrls: ['./communal-map.component.scss']
})
export class CommunalMapComponent implements OnInit, AfterViewInit {

  @Output() forMap: EventEmitter<L.Map> = new EventEmitter();
  map: L.Map;
  curPolygon: L.Polygon<any>;
  userRole: any;
  editableLayers: L.FeatureGroup = new L.FeatureGroup();

  connectionPointLayer: any[] = [];

  @Input() app: app.App;
  @Input() orgApp: utilcompany.UtilCompanyApp;
  @Input() isDraw: boolean;

  constructor(
    private mapSvc: MapService,
    private mapControlSvc: MapControlsService,
    private geomSvc: GeomService,
    private identifySvc: IdentifyService,
    private authService: AuthService,
    private api: ApiService,
    private render: Renderer2,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.currenUserData();
    this.initMap();
    this.initDrawSubscription();
    this.getAppConnections();
  }

  initMap() {
    const ControlOptions: mapmodel.ControlOpts = {
      scale: true,
      fullscreen: true
    };
    this.map = this.mapSvc.initMap('uappcardmapid', ControlOptions);

    this.map.on('mouseover', (evt: any) => {
      if (this.isDraw) {
        this.map.eachLayer((layer: any) => {
          layer.on('mouseover', (e) => {
            // @ts-ignore
            if (layer.objectType === 'circlemarker') {
              const el = `<span style="padding: 13px 0px 0px 2px;
              margin-right: 4px; color: #acac3f;
              border: 1px solid #333;
              border-radius: 2px; cursor: pointer;"
              class="edit_layer_text">
              <i class="material-icons"> edit </i> </span>

              <span style="padding: 13px 2px 0px 2px;
              margin-right: 4px; color: #df0b0b;
              border: 1px solid #333;
              border-radius: 2px; cursor: pointer;"
              class="remove_layer">
              <i class="material-icons"> delete </i> </span>`;
              layer.bindPopup(el);

              layer.openPopup();
              layer.isPopupOpen();

              let markerContent: any;
              const editLayer: any = document.querySelectorAll('.edit_layer_text');
              editLayer.forEach(element => {
                this.render.listen(element, 'click', (target) => {
                  const textbox = `<label>Примечание:</label><br/>
                  <textarea class="app_agreement_mnote_${layer._leaflet_id}" rows="4"
                  style="resize:none;"></textarea>`;
                  layer.bindPopup(textbox);
                  layer.openPopup();
                  layer.isPopupOpen();
                  markerContent = document.getElementsByClassName(`app_agreement_mnote_${layer._leaflet_id}`)[0];
                  // @ts-ignore
                  markerContent.value = layer.textContent;
                });
              });

              const removeLayer: any = document.querySelectorAll('.remove_layer');
              removeLayer.forEach(element => {
                this.render.listen(element, 'click', (target) => {
                  layer.closePopup();
                  this.removeConnectionPointLayer(layer);
                });
              });

              layer.on('popupclose', (ev) => {
                if (layer) {
                  setTimeout(() => {
                    if (markerContent) {
                      this.geomSvc.getMarkerBindLabel(this.map, layer, markerContent.value);
                      // @ts-ignore
                      layer.textContent = markerContent.value;
                    }
                  }, 100);
                  layer.unbindPopup();
                }
              });
            }
          });
        });
      }
    });

    this.map.on('click', (evt: any) => {
      this.map.eachLayer(layer => {
        layer.closePopup();
      });
      this.identifySvc.showGetFeatureInfo(this.map, evt.latlng);
    });


    if (this.isDraw) {
      this.map.addLayer(this.editableLayers);
      this.mapControlSvc.initDraw(this.map, {
          layers: this.editableLayers,
          edit: false,
          remove: false
        }, {
          position: 'topright',
          draw: ['circlemarker']
        }
      );
    }

    const controlCurrLocContainer = this.mapControlSvc.initFitCurrLocationControl(this.map);
    controlCurrLocContainer.onclick = () => {
      if (this.curPolygon) {
        this.map.fitBounds(this.curPolygon.getBounds());
      }
    };

    this.checkUserRolesForLayers();

    this.showAppGeomLocation();
  }

  checkUserRolesForLayers() {
    if (this.authService.currentUser && this.authService.tokenData.authorities.some(e => e === ROLES.DUTY_MAP ||
      e === ROLES.OZO || e === ROLES.GEO_TAX)) {
      this.mapControlSvc.fetchLayerThemes();
    }
  }

  initDrawSubscription() {
    this.mapControlSvc.drawSubject.subscribe((val: any) => {
      const drawevent = val.drawevent;
      const type = val.type;

      if (drawevent === 'drawend') {
        if (type === 'circlemarker') {
          const drawedLayer = JSON.stringify(val.layer.toGeoJSON());
          this.map.removeLayer(val.layer);
          const layer = this.geomSvc.drawCustomMarker(this.map, drawedLayer, 2);
          layer.addTo(this.map);
          // @ts-ignore
          layer.drawevent = val.drawevent;
          const el = `<label>Примечание:</label><br/>
          <textarea class="app_agreement_mnote" rows="4"
          style="resize:none;"></textarea>`;
          layer.bindPopup(el);

          layer.openPopup();
          const markerContent: any = document.getElementsByClassName('app_agreement_mnote')[0];

          layer.on('popupclose', (e) => {
            if (layer) {
              setTimeout(() => {
                // if (markerContent) {
                this.geomSvc.getMarkerBindLabel(this.map, layer, markerContent.value);
                val.layer = layer;
                val.layer.textContent = markerContent.value;
                // }
              }, 100);
              layer.unbindPopup();
            }
          });
        }
      }
    });
  }

  cleanAllFeatures() {
    if (this.editableLayers.getLayers().length > 0) {
      this.editableLayers.clearLayers();
    }
  }

  showAppGeomLocation() {
    if (this.app.subservice.service.id === 13) {
      if (this.app.objectInfo.archLocation !== '') {
        const polygon = this.geomSvc.showPolygon(this.map, this.app.objectInfo.archLocation);
        this.curPolygon = polygon;
        const controlContainer = this.mapControlSvc.initExtractWKTControl(this.map);
        controlContainer.onclick = () => {
          const polygonWkt = this.geomSvc.toWKT(polygon, true);
          this.showDialogBox(polygonWkt);
        };
      }
    } else {
      if (this.app.objectInfo.location !== '') {
        const polygon = this.geomSvc.showPolygon(this.map, this.app.objectInfo.location);
        this.curPolygon = polygon;
        const controlContainer = this.mapControlSvc.initExtractWKTControl(this.map);
        controlContainer.onclick = () => {
          const polygonWkt = this.geomSvc.toWKT(polygon, true);
          this.showDialogBox(polygonWkt);
        };
      }
    }
  }

  getAppConnections() {
    this.api.get2('apporg/' + this.orgApp.id + '/connections').subscribe(data => {
      this.connectionPointLayer = data;
      this.connectionPointLayer.forEach(i => {
        const layer = this.geomSvc.drawCustomMarker(this.map, i.connection, 4, i.data);
        layer.addTo(this.map);
        // @ts-ignore
        layer.id = i.id;
      });
    });
  }

  removeConnectionPointLayer(layer: any) {
    if (layer.drawevent === 'drawend') {
      this.map.removeLayer(layer);
    } else {
      this.api.delete('apporg/' + this.orgApp.id + '/connections/' + layer.id).subscribe(data => {
        if (data.status === 200) {
          this.map.removeLayer(layer);
        }
      });
    }
  }

  showDialogBox(msg: string) {
    let dialogRef = null;
    if (!dialogRef) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '400px';
      dialogConfig.autoFocus = true;
      dialogConfig.data = {title: 'WKT', message: msg};
      dialogRef = this.dialog.open(MessageBoxComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(() => {
        dialogRef = null;
      });
    }
  }

  currenUserData() {
    this.authService.userInfo$.subscribe((user: auth.User) => {
      if (user) {
        const tokenData = this.authService.getTokenData();
        this.userRole = tokenData ? tokenData.authorities : [];
        const controlPopupContainer = this.mapControlSvc.initPopupControl(this.map);
        controlPopupContainer.onclick = () => {
          if (this.mapControlSvc.userLayers.length && this.mapControlSvc.allLayersInitialized) {
            this.mapControlSvc.panelLayersControl(this.map, user, this.userRole);
          }
        };
      }
    });
    this.authService.init();
  }

}

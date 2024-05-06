import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {app} from '../../shared/models/application.model';
import {auth} from '../../shared/models/auth.model';
import {MapService} from '../../services/map.service';
import {MapControlsService} from '../../services/map.controls.service';
import {GeomService} from '../../services/geom.service';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {AuthService} from '../../services/auth.service';
import * as L from 'leaflet';
import {mapmodel} from '../../shared/models/map.model';
import {MessageBoxComponent} from '../message-box/message-box.component';
import {ROLES} from '../../shared/utils/constants';
import {IdentifyService} from '../../services/identify.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ConnectedLayerService} from '../../services/connected-layer.service';

@Component({
  selector: 'app-arch-map',
  templateUrl: './arch-map.component.html',
  styleUrls: ['./arch-map.component.scss']
})
export class ArchMapComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() app: app.App;
  @Input() isDraw: boolean;
  @Input() appArchLayer: boolean;
  @Output() archLocation = new EventEmitter();

  map: L.Map;
  dialogRef = null;
  curPolygon = null;
  curArchPolygon = null;
  userRole: any = [];
  currentUser: auth.User = null;
  base64textString: string;
  editableLayers: L.FeatureGroup = new L.FeatureGroup();
  btnPolRemVisib = false;
  curArchPolygonGeoJson = '';

  investLandProjectServiceId = 13;
  ijsId = 14;
  destroyed$ = new Subject();

  constructor(
    private mapSvc: MapService,
    private mapControlsSvc: MapControlsService,
    private geomSvc: GeomService,
    private authService: AuthService,
    public dialog: MatDialog,
    private elementRef: ElementRef,
    private identifySvc: IdentifyService,
    private conLyrSvc: ConnectedLayerService,
    private elem: ElementRef
  ) {
  }

  ngOnInit() {
    this.currenUserData();
    if ([130].includes(this.app.subservice.id)) { this.mapControlsSvc.allLayersInitialized = true; }
  }

  ngAfterViewInit() {
    this.initMap();
    this.showLocation();
    this.initDrawSubscription();
    this.map.on('click', (e) => this.handleMapClick(e));
    if (this.app && this.app.subservice.service.id === this.investLandProjectServiceId) {
      this.showAppGeomArchLocation();
    } else {
      this.showAppGeomLocation();
    }
    this.initDrawPolygon();
    this.checkUserRolesForLayers();
    if (this.appArchLayer) {
      this.initAppArchLayer();
    }
  }


  initMap() {
    const ControlOptions: mapmodel.ControlOpts = {
      scale: true,
      fullscreen: true
    };
    this.map = this.mapSvc.initMap('archappcardmapid', ControlOptions);

    /*if (this.app.subservice.id === this.copyTopoplanSubserviceId || this.app.subservice.service.id === this.investLandProjectServiceId) {
      this.controlMapScale();
    }*/

    if (this.app) {
      if (this.app.subservice.id === 14) {
        if (!this.app.archSigned) {
          this.map.addLayer(this.editableLayers);
          this.mapControlsSvc.initDraw(this.map, {
              layers: this.editableLayers,
              edit: false,
              remove: true
            },
            {
              position: 'topright',
              draw: ['polygon']
            });
        }
      }
    }

    if (this.curArchPolygon === null || this.curArchPolygon === undefined) {
      if (this.app && this.app.objectInfo) {
        if (this.app.objectInfo.archLocation !== '') {
          this.curArchPolygon = this.app.objectInfo.archLocation;
        }
      }

    }


    if (this.curPolygon === null || this.curPolygon === undefined) {
      if (this.app && this.app.objectInfo) {
        if (this.app.objectInfo.location !== '') {
          this.curPolygon = this.app.objectInfo.location;
        }
      }
    }


    const controlContainer = this.mapControlsSvc.initExtractWKTControl(this.map);
    controlContainer.onclick = () => {
      if (this.curPolygon) {
        const polygonWkt = this.geomSvc.toWKT(this.curPolygon, true);
        this.showDialogBox(polygonWkt);
      }

    };

    const controlCurrLocContainer = this.mapControlsSvc.initFitCurrLocationControl(this.map);
    controlCurrLocContainer.onclick = () => {
      if (this.curPolygon) {
        this.map.fitBounds(this.curPolygon.getBounds());
      }
    };

  }

  controlMapScale() {
    this.mapControlsSvc.initMapScaleControl(this.map);
  }

  showAppGeomLocation() {
    if (this.app && this.app.objectInfo && this.app.objectInfo.location !== '') {
      if ([152].includes(this.app.subservice.id) && this.app.objectInfo.location.includes('))')) {
        const geojson = JSON.stringify(this.geomSvc.parseWKTToGeometry(this.app.objectInfo.location));
        this.curPolygon = this.geomSvc.showPolygon(this.map, geojson);
      } else {
        this.curPolygon = this.geomSvc.showPolygon(this.map, this.app.objectInfo.location);
      }
    }
  }

  showAppGeomArchLocation() {
    if (this.app.objectInfo.archLocation !== '') {
      this.curArchPolygon = this.geomSvc.showPolygon(this.map, this.app.objectInfo.archLocation, 'green');
    }
  }

  private handleMapClick(event: any) {
    if (this.mapControlsSvc.selectedLayer) {
      this.identifySvc.showFeatureInfo(event.latlng);
    }
  }

  showDialogBox(msg: string) {
    if (!this.dialogRef) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '400px';
      dialogConfig.autoFocus = true;
      dialogConfig.data = {title: 'WKT', message: msg};
      this.dialogRef = this.dialog.open(MessageBoxComponent, dialogConfig);

      this.dialogRef.afterClosed().pipe(takeUntil(this.destroyed$))
        .subscribe(() => {
          this.dialogRef = null;
        });
    }
  }

  currenUserData() {
    this.authService.userInfo$.pipe(takeUntil(this.destroyed$))
      .subscribe((user: auth.User) => {
        if (user) {
          this.currentUser = user;
          const tokenData = this.authService.getTokenData();
          this.userRole = tokenData ? tokenData.authorities : [];
          this.addPopupContainer();
          this.addUncheckLayersControl();
        }
      });
    this.authService.init();
  }

  public addPopupContainer() {
    const controlPopupContainer = this.mapControlsSvc.initPopupControl(this.map);
    controlPopupContainer.onclick = () => {
      if (this.mapControlsSvc.userLayers.length && this.mapControlsSvc.allLayersInitialized) {
        this.mapControlsSvc.panelLayersControl(this.map, this.currentUser, this.userRole);
        this.elementRef.nativeElement.querySelectorAll('.leaflet-panel-layers-selector').forEach((item) => {
          item.addEventListener('click', this.setSelectedLayer.bind(this, item));
        });
      }
    };

  }

  public addUncheckLayersControl() {
    const controlUnselectLayers = this.mapControlsSvc.initUncheckLayersControl(this.map);
    controlUnselectLayers.onclick = () => {
      const elements = this.elem.nativeElement.querySelectorAll('.leaflet-panel-layers-selector', 'input');
      elements.forEach(element => {
        if (element.type === 'checkbox' && element.checked) {
          element.checked = false;
          /*this.map.removeLayer(this.mapControlsSvc.selectedLayer[0]);*/
        }
      });
      this.removeCheckedLayers();
    };
  }

  private removeCheckedLayers() {
    const layers = [];
    this.map.eachLayer((layer: any) => {
      if (layer.wmsParams && layer instanceof L.TileLayer)
        layers.push(layer);
    });
    layers.forEach(layer => {
      this.map.removeLayer(layer);
    });
  }

  checkUserRolesForLayers() {
    if (this.authService.currentUser && this.authService.tokenData.authorities.some(e => e === ROLES.DUTY_MAP ||
      e === ROLES.OZO || e === ROLES.GEO_TAX)) {
      this.mapControlsSvc.fetchLayerThemes();
    }
  }

  setSelectedLayer(this, item) {
    this.mapControlsSvc.setSelectedLayer(item._layer);
  }

  initDrawSubscription() {
    this.mapControlsSvc.drawSubject.pipe(takeUntil(this.destroyed$))
      .subscribe((val: any) => {
        if (val.drawevent === 'drawend') {
          this.cleanAllFeatures();
          this.editableLayers.addLayer(val.layer);
          const geoData = val.layer.toGeoJSON();
          console.log('new polygon', geoData);
          this.fillObjectGeom(geoData, true);
          this.archLocation.emit(JSON.stringify(geoData));
        }
      });
  }

  initDrawPolygon() {
    this.mapControlsSvc.drawPolygonByCoord.pipe(takeUntil(this.destroyed$))
      .subscribe((val: any) => {
        if (val) {
          this.cleanAllFeatures();
          this.editableLayers.addLayer(val);
          const geoData = val.toGeoJSON();
          this.fillObjectGeom(geoData, true);
          this.archLocation.emit(JSON.stringify(geoData));
        }
      });
  }

  fillObjectGeom(geoData, isdrawn) {
    geoData.properties.isdrawn = isdrawn;
    if (this.app.objectInfo) {
      this.app.objectInfo.archLocation = JSON.stringify(geoData);
    }
    if (this.app.subservice.id === this.ijsId) {
      this.app.ozoInfo.location = JSON.stringify(geoData);
    }
  }

  cleanAllFeatures() {
    if (this.editableLayers.getLayers().length > 0) {
      this.editableLayers.clearLayers();
    }
    if (this.curArchPolygon) {
      this.map.removeLayer(this.curArchPolygon);
      this.curArchPolygon = null;
      this.btnPolRemVisib = false;
    }
  }

  showLocation() {
    if (this.app && this.app.objectInfo) {
      if (this.app.objectInfo.archLocation && this.app.objectInfo.archLocation !== '') {
        this.curArchPolygon = this.geomSvc.showPolygon(this.map, this.app.objectInfo.archLocation);
        if (this.curArchPolygon) {
          this.btnPolRemVisib = true;
        }
      }
    }
    if (this.app && this.app.ozoInfo && this.ijsId === this.app.subservice.id) {
      if (this.app.ozoInfo.location) {
        this.curArchPolygon = this.geomSvc.showPolygon(this.map, this.app.ozoInfo.location);
      }
    }
  }

  initAppArchLayer() {
    const url = 'http://geo.eatyrau.kz:51801/geoserver/atyrau/';

    const layer = {
      name: 'app_arch',
      layerId: 1221,
      layer: this.mapControlsSvc.getWmsTileLayerCity('app_arch', url)
    };

    this.map.addLayer(layer.layer);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }


}

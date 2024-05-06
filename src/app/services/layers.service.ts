import {Injectable} from '@angular/core';

import * as L from 'leaflet';
import {HttpParams, HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CONST} from '../config';
import {ApiService} from './api.service';
import CONFIG = CONST.CONFIG;

@Injectable()
export class LayersService {
  public googleHybridLayer = L.tileLayer(
    'http://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      maxZoom: 21,
      minZoom: 7,
      attribution: ``
    });
  public googleRoadLayer = L.tileLayer(
    'http://mt0.google.com/vt/lyrs=m&hl=ru&x={x}&y={y}&z={z}&s=Galileo', {
      maxZoom: 21,
      minZoom: 7,
      attribution: ``
    });
  identifyLayersLst: string[] = [];
  private layerObject: object;

  constructor(
    private http: HttpClient,
    private api: ApiService
  ) {
  }

  addWMSLayerByName(baseUrl: string, map: L.Map, lyrName: string, zIndex?: number) {
    if (zIndex === null) {
      const tileLyr = L.tileLayer.wms(baseUrl + `/wms?service=WMS`, {
        layers: lyrName,
        format: 'image/png',
        transparent: true,
        version: '1.1.0',
        // zIndex: 500,
        maxZoom: 21,
        minZoom: 7
      }).addTo(map);
    } else {
      const tileLyr = L.tileLayer.wms(baseUrl + `/wms?service=WMS`, {
        layers: lyrName,
        format: 'image/png',
        transparent: true,
        version: '1.1.0',
        zIndex: zIndex,
        maxZoom: 21,
        minZoom: 7
      }).addTo(map);
    }

  }

  fillLayerGroupAttrs(lyrs: L.FeatureGroup) {
    const notes = [];
    lyrs.eachLayer(lyr => {
      if (lyr) {
        const popup = lyr.getPopup();
        if (popup) {
          const content = popup.getContent();
          notes.push(content);
        }
      }
    });
    const featColls: any = lyrs.toGeoJSON();
    for (let i = 0; i < featColls.features.length; i++) {
      const element = featColls.features[i];
      element.properties.note = notes[i];
    }
    return featColls;
  }

  getAuctionFeatureInfo(): Observable<any> {
    const params = new HttpParams()
      .set('service', 'WFS')
      // .set('version', '2.0.0')
      .set('version', '1.1.0')
      .set('request', 'GetFeature')
      .set('typeName', 'atyrau:auction_lands')
      .set('srsName', 'EPSG:3857')
      .set('outputFormat', 'application/json');
    return this.http.get(CONST.CONFIG.GEOSERVER_CAD_URL + 'utilities/wms?', {params});
  }

  fillPolygonCoordinates(coordinates) {
    const latLng = [];
    const coords = coordinates[0][0];
    for (let i = 0; i < coords.length; i++) {
      const c = coords[i];
      const point = [];
      const LatLng = L.Projection.SphericalMercator.unproject(L.point(c));
      point.push(LatLng.lat);
      point.push(LatLng.lng);
      latLng.push(point);
    }
    return L.polygon(latLng);
  }

  public getUserLayerTreeParent(userId: number) {
    return this.api.getWithAuth(CONFIG.DUTYMAP_SERVICES_URL + `permissions/treelayer/parent?userId=${userId}`);
  }

  public getLayerByLayerName(layerName: string, geoserverId: number) {
    if (layerName) {
      return this.api.getWithAuth(CONFIG.DUTYMAP_SERVICES_URL + `layers/${layerName}?geoserverId=${geoserverId}`);
    }
    return null;
  }

  public getLayerObjectFromService(layerName: string, objectId: number, geoserverId: number) {
    if (layerName && objectId) {
      const url = CONFIG.DUTYMAP_SERVICES_URL + `layers/${layerName}/objects/${objectId}?geoserverId=${geoserverId}`;
      return this.api.getWithAuth(url);
    }
    return null;
  }

  public setLayerObject(layerObject: any): object {
    return this.layerObject = layerObject;
  }

  public getLayerObject(): any {
    return this.layerObject;
  }

  public getAttributesByLayerName(layerName: string, geoserverId: number) {
    if (layerName) {
      return this.api.getWithAuth(CONFIG.DUTYMAP_SERVICES_URL + `layers/${layerName}/attributes?geoserverId=${geoserverId}`);
    }
    return null;
  }
}

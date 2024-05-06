import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import * as L from 'leaflet';

import {ConnectedLayerService} from './connected-layer.service';
import {LayersService} from './layers.service';
import {ApiService} from './api.service';
import {MapControlsService} from './map.controls.service';
import {MapService} from './map.service';
import {forkJoin, Observable} from 'rxjs';
import {Feature, FeatureCollection} from 'geojson';

import {LayerAttribute} from '../shared/models/layer/layer-attribute';
import {Layer} from '../shared/models/layer/layer';
import {LayerGroup} from '../shared/models/layer/layer-group.model';

@Injectable()
export class IdentifyService {
  layerName: string;
  private layerInfoByFeature: Layer = null;
  private layerAttributes: LayerAttribute[] = [];

  constructor(
    private http: HttpClient,
    private lyrSvc: LayersService,
    private api: ApiService,
    private conLyrSvc: ConnectedLayerService,
    private mapControlsSvc: MapControlsService,
    private mapSvc: MapService
  ) {
  }

  showGetFeatureInfo(map: L.Map, latlng) {
    this.conLyrSvc.getConnectedLayers();
    const popup = L.popup()
      .setLatLng(latlng)
      // .setContent('<br />')
      .setContent('<img src="../../assets/images/spinner.gif" alt="preloader" style="height:16px;width:16px;padding-left:16px;">')
      .openOn(map);
    // const LatLng = L.Projection.SphericalMercator.project(latlng);
    const resp = this.getFeatureInfo(map, latlng);
    resp.subscribe(
      (data: any) => {
        if (data.features && data.features.length > 0) {
          this.layerName = data.features['0'].id.split('.');
          this.http.post('/eqyzmet/api/engineering/get/layers', {
            layerName: this.layerName[0]
          }).subscribe(res => {
            if (res) {
              this.showPopup(data, popup, res);
            }
          }, err => {
            this.showPopup(data, popup);
          });
        } else {
          popup.setContent('<p>Ничего не найдено</p>');
        }
      },
      error => {
        console.log('error: ', error);
        popup.setContent('<p>Ничего не найдено</p>');
      }
    );
    // console.log('resp: ', resp);
  }

  getFeatureInfo(map: L.Map, latlng: any, burl?: string) {
    // const baseUrl = CONFIG.GEOSERVER_URL + `utilities/wms?`;
    const baseUrl = burl ? burl : '/geoserver/utilities/wms?';
    const url = this.getFeatureInfoUrl(baseUrl, map, latlng);
    return this.http.get(url);
  }

  private getFeatureInfoUrl(baseurl: string, map: L.Map, latlng: L.LatLng) {
    const point = map.latLngToContainerPoint(latlng),
      size = map.getSize(),
      params = {
        request: 'GetFeatureInfo',
        service: 'WMS',
        srs: 'EPSG:3857',
        // styles: '',
        transparent: true,
        version: '1.1.1',
        format: 'image/png',
        // bbox: map.getBounds().toBBoxString(),
        bbox: this.getMercatorBBoxString(map),
        height: size.y,
        width: size.x,
        layers: this.lyrSvc.identifyLayersLst, // ['utilities:heat_teplovie_punkti_a'],
        query_layers: this.lyrSvc.identifyLayersLst, // ['utilities:heat_teplovie_punkti_a'],
        info_format: 'application/json',
        // info_format: 'text/html'
      };

    params[params.version === '1.3.0' ? 'i' : 'x'] = Math.round(point.x);
    params[params.version === '1.3.0' ? 'j' : 'y'] = Math.round(point.y);

    return baseurl + L.Util.getParamString(params, baseurl, true);
  }

  getMercatorBBoxString(map: L.Map) {
    const bounds = map.getBounds();
    const west = L.Projection.SphericalMercator.project(bounds.getNorthWest()).x;
    const south = L.Projection.SphericalMercator.project(bounds.getSouthWest()).y;
    const east = L.Projection.SphericalMercator.project(bounds.getNorthEast()).x;
    const north = L.Projection.SphericalMercator.project(bounds.getNorthWest()).y;
    return west + ',' + south + ',' + east + ',' + north + '';
  }

  buildFeatureInfoContent(data: any, popup: any) {
    const props = data.features['0'].properties;
    let content = '';
    // let content = '<p>' + props.layername + '<br />';
    for (const item in props) {
      // console.log(item + ': ' + props[item]);
      const propValue = props[item];
      if (propValue && item !== 'shape_area' && item !== 'shape_leng') {
        content += '<p><strong>' + item + '</strong>: ' + propValue + '<br />';
      }
      popup.setContent(content);
    }
  }

  // end
  showPopup(data: any, popup: any, attrs?: any) {
    const props = data.features['0'].properties;
    let content = '';
    for (const item in props) {
      let attr;
      if (attrs !== undefined && attrs) {
        attr = attrs.filter(a => a.nameEn === item);
      }
      if (attrs !== undefined && attr.length > 0) {
        attr = attrs ? attr[0].nameRu : item;
      } else {
        attr = item;
      }
      const propValue = props[item];
      if (propValue && item !== 'shape_area' && item !== 'shape_leng') {
        content += '<p><strong>' + attr + '</strong>: ' + propValue + '<br />';
      }
    }
    popup.setContent(content);
  }

  public async showFeatureInfo(latlng: L.LatLng) {
    const geoportalUrls = this.fetchGeoportalUrlsFromLayers(this.mapControlsSvc.selectedLayer);
    if (!geoportalUrls.length) {
      this.setPopupContent(latlng, '<p>Произошла ошибка! Не найден геосервер!</p>');
      return;
    }
    const requests = geoportalUrls.map(url => {
      return this.getFeatureInfoDutyMap(url, latlng);
    });
    const obs$: Observable<any[]> = forkJoin(requests);
    obs$.subscribe((reqs: Observable<any>[]) => {
      reqs.forEach((req, index) => {
        req.subscribe((f: FeatureCollection) => {
          if (f && f.features && f.features.length) {
            const fLayerData = this.getLayerDataFromFeatures(f.features[0]);
            const fLayerName = fLayerData[0];
            const layerGroup = this.mapControlsSvc.selectedLayer.find(l => l.layerGroupName === fLayerName);
            if (layerGroup && layerGroup.geoserver && layerGroup.geoserver.id) {
              this.showFeatureInfoDutyMap(latlng, f.features[0], layerGroup);
              return;
            }
          } else if (index === reqs.length - 1) {
            this.setPopupContent(latlng, '<p>Нет данных</p>');
          }
        });
      });
    });
  }

  private getLayerDataFromFeatures(feature: Feature) {
    if (!feature) {
      return null;
    }
    const featureId: any = feature.id ? feature.id : null;
    return featureId ? featureId.split('.') : null;
  }

  public fetchGeoportalUrlsFromLayers(layers: any []) {
    const arr = [];
    layers.map(l => {
      if (l.geoserver && l.geoserver.urlContext) {
        arr.push(l.geoserver.urlContext);
      } else if (l.layerSource && l.layerSource.url) {
        arr.push(l.layerSource.url);
      }
    });
    return [...new Set(arr)];
  }

  public async getFeatureInfoDutyMap(baseUrl: string, latlng: L.LatLng) {
    const layers = this.fetchLayersByGeoportalUrl(this.mapControlsSvc.selectedLayer, baseUrl).join(',');
    const group = baseUrl.split('/');
    const layerQuery = layers.length ? group[group.length - 1] + ':' + layers : '';
    const url = this.getFeatureInfoUrlDutyMap(baseUrl + '/wms?', latlng, layerQuery, 'EPSG:3857');
    return this.http.get(url);
  }

  public fetchLayersByGeoportalUrl(layers: any[], url: string) {
    const arr = [];
    layers.map(l => {
      if (l.geoserver && l.geoserver.urlContext === url) {
        arr.push(l.layerGroupName);
      } else if (l.layerSource && l.layerSource.url === url) {
        arr.push(l.layerName);
      }
    });
    return arr;
  }

  private getFeatureInfoUrlDutyMap(baseUrl: string, latlng: L.LatLng, layers: string, epsg: string = 'EPSG:4326') {
    const map = this.mapSvc.map;
    const point = map.latLngToContainerPoint(latlng);
    const size = map.getSize();
    const params = {
      request: 'GetFeatureInfo',
      service: 'WMS',
      srs: epsg,
      // styles: '',
      transparent: true,
      version: '1.1.1',
      format: 'image/png',
      // bbox: map.getBounds().toBBoxString(),
      bbox: this.getMercatorBBoxString(map),
      height: size.y,
      width: size.x,
      layers: layers, // ['utilities:heat_teplovie_punkti_a'],
      query_layers: layers, // ['utilities:heat_teplovie_punkti_a'],
      info_format: 'application/json',
      // info_format: 'text/html'
    };

    params[params.version === '1.3.0' ? 'i' : 'x'] = Math.round(point.x);
    params[params.version === '1.3.0' ? 'j' : 'y'] = Math.round(point.y);

    return baseUrl + L.Util.getParamString(params, baseUrl, true);
  }

  public async showFeatureInfoDutyMap(latlng: L.LatLng, feature: Feature, layerGroup: LayerGroup) {
    const layerObjectId = +this.getLayerDataFromFeatures(feature)[1];
    await this.fetchLayerInfo(layerGroup.layerGroupName, layerGroup.geoserver.id);
    //await this.fetchLayerObject(layerGroup.layerGroupName, layerObjectId, layerGroup.geoserver.id);
    this.showPopupDutyMap(feature, latlng, layerGroup.layerGroupName, layerGroup.geoserver.id);
  }

  private async fetchLayerInfo(layerName: string, geoserverId: number) {
    await this.lyrSvc.getLayerByLayerName(layerName, geoserverId).toPromise()
      .then((data: Layer) => {
        this.layerInfoByFeature = data ? data : null;
      })
      .catch((error) => this.layerInfoByFeature = null);
  }

  private async fetchLayerObject(layerName: string, layerObjectId: number, geoserverId: number) {
    await this.lyrSvc.getLayerObjectFromService(layerName, layerObjectId, geoserverId).toPromise()
      .then((data: Layer) => {
        this.lyrSvc.setLayerObject(data ? data : null);
      })
      .catch((error) => this.lyrSvc.setLayerObject(null));
  }

  private async showPopupDutyMap(feature: Feature, latlng: L.LatLng, layerName: string, geoserverId: number) {
    await this.fetchLayerAttributes(layerName, geoserverId);
    const props = feature.properties;
    if (this.layerAttributes && this.layerAttributes.length) {
      const headerContent = this.fetchPopupHeaderContentFromFeature(feature);
      const content = headerContent + this.fetchLayerProps(props, this.layerAttributes);
      this.setPopupContent(latlng, content ? content : '<p>Нет данных</p>');
    } else {
      const headerContent = this.fetchPopupHeaderContentFromFeature(feature);
      this.setPopupContent(latlng, headerContent ? headerContent : '<p>Нет данных</p>');
    }
  }

  private async fetchLayerAttributes(layerName: string, geoserverId: number) {
    await this.lyrSvc.getAttributesByLayerName(layerName, geoserverId).toPromise()
      .then((attrs: LayerAttribute[]) => {
        this.layerAttributes = attrs && attrs.length ? this.sortByOrder(attrs) : [];
      })
      .catch((error) => this.layerAttributes = []);
  }

  public sortByOrder(arr: any[]) {
    return arr.sort((a, b) => a.orderId - b.orderId);
  }

  private fetchPopupHeaderContentFromFeature(feature: Feature) {
    const featureId: any = feature.id ? feature.id : null;
    if (!featureId) {
      return '';
    }
    const featureIdContent = featureId.split('.');

    let layerNameAttr = '';
    if (this.layerInfoByFeature && this.layerInfoByFeature.nameRu) {
      layerNameAttr = `<p><strong>${this.layerInfoByFeature.nameRu}‎</strong><br />`;
    } else {
      layerNameAttr = featureIdContent[0] ? `<p><strong>${featureIdContent[0]}‎</strong><br />` : '';
    }
    const id = featureIdContent[1] ? `<p><strong>gid: ${featureIdContent[1]}‎</strong><br />` : '';
    return layerNameAttr + id;
  }

  private fetchLayerProps(props: object, attrs: LayerAttribute[]) {
    let content = '';
    attrs.forEach((attr: LayerAttribute) => {
      const key = attr.attrName;
      if (props.hasOwnProperty(key)) {
        const propValue = props[key] ? props[key] : '';
        if (key !== 'shape_area' && key !== 'shape_leng') {
          content += '<tr>' + `<td>${attr.nameRu}</td>` + `<td>${propValue}</td>` + '</tr>';
        }
      }
    });
    return content ? `<div class="table-container">
                            <table class="table table-bordered">${content}</table>
                          </div>` : content;
  }

  private setPopupContent(latlng: L.LatLng, content: string) {
    const popup = L.popup().setLatLng(latlng)
      .setContent(`<div class="leaflet-custom-popup-content">${content}</div>`)
      .openOn(this.mapSvc.map);
  }

}

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MapControlsService} from './map.controls.service';

import {CONST} from '../config';

import {mapmodel} from '../shared/models/map.model';

import * as L from 'leaflet';
import 'leaflet.gridlayer.googlemutant';
import {Observable} from 'rxjs';

@Injectable()
export class MapService {
  public map: L.Map;

  constructor(
    private http: HttpClient,
    private controlsSvc: MapControlsService
  ) {
  }

  initMap(target: string, controlOpts: mapmodel.ControlOpts =
    {
      scale: true,
      fullscreen: false
    }): L.Map {
    const map = L.map(target).setView([42.902, 71.435], 12);

    const googleHybridLayer = L.tileLayer(
      'http://mt.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        maxZoom: 21,
        minZoom: 7,
        attribution: ``
      }
    );
    googleHybridLayer.addTo(map);

    if (controlOpts.scale) {
      this.controlsSvc.initScale(map);
    }

    if (controlOpts.fullscreen) {
      this.controlsSvc.initFullscreen(map);
    }
    this.map = map;
    return map;
  }

  addPolygon(map: L.Map, geom: any) {
    const polygon = L.polygon(geom).addTo(map);
  }

  getLandGeomByCadNumber(cadNumber: string) {
    const url = CONST.CONFIG.GEOSERVER_URL +
      `gis/wms?service=WFS&version=1.0.0&request=GetFeature&typeName=gis:gzk_features_moved
            &outputFormat=application%2Fjson&CQL_FILTER=cad_number=%27` + cadNumber + `%27`;
    return this.http.get(url);
  }

  public getIntegrSubject(cadNumber: string): Observable<any> {
    const url = CONST.CONFIG.GEO_INTEGRATION_API + 'gzk/attributes?cadNumber=' + cadNumber + '&isFormatted=true&systemKey=456789';
    const headers = {'Authorization': 'Bearer ' + localStorage.access_token};
    return this.http.get(url, {
      headers: new HttpHeaders(headers),
    });
  }


}

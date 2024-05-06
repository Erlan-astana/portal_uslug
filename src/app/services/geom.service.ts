import {Injectable} from '@angular/core';

import * as L from 'leaflet';
import * as proj4x from 'proj4';
import * as WKT from 'terraformer-wkt-parser';
import { GeometryObject, Feature } from 'geojson';

import '../../../libs/leaflet/polygon-fillPattern/leaflet.pattern.js';

@Injectable()
export class GeomService {
  public map: L.Map;

  EPSG32642 = '+proj=utm +zone=42 +ellps=WGS84 +datum=WGS84 +units=m +no_defs';
  WGS84 = '+proj=longlat +datum=WGS84 +no_defs';
  EPSG97 = `+proj=tmerc +lat_0=0 +lon_0=51 +k=1 +x_0=-58000 +y_0=-5205500 +ellps=krass
            +units=m +towgs84=-60.873,-78.533,-110.658,2.63496,2.70103,-0.58073,6.158113 +no_defs`;

  constructor() {
  }

  addPolygonFromCoords97(coords: any) {
    const proj4 = (proj4x as any).default, spCoords = [];
    coords = coords[0][0];
    for (let i = 0; i < coords.length; i++) {
      const point = proj4(this.EPSG97, this.WGS84, proj4.toPoint(coords[i]));
      spCoords.push([point.y, point.x]);
    }
    return L.polygon(spCoords);
  }

  showPolygon(map: L.Map, geomStr: string, color?) {
    const geoJsonData = JSON.parse(geomStr);
    let coords = null;

    if (geoJsonData && geoJsonData.geometry && geoJsonData.geometry.coordinates) {
      coords = geoJsonData.geometry.coordinates[0];
    } else {
      return null;
    }
    coords.forEach(coord => {
      const LatLng = L.GeoJSON.coordsToLatLng(coord);
      coord[0] = LatLng.lat;
      coord[1] = LatLng.lng;
    });
    let polygon;
    if (color && color !== '') {
      polygon = L.polygon([coords], {color: color});
    } else {
      polygon = L.polygon([coords]);
    }

    if (polygon) {
      // polygon.
      polygon.addTo(map);
      map.fitBounds(polygon.getBounds());
      map.setZoom(map.getZoom() - 2);
      return polygon;
    } else {
      return null;
    }
  }

  showPolygonIJS(map: L.Map, geomStr: string) {
    const geoJsonData = JSON.parse(geomStr);
    let coords = null;
    if (geoJsonData.geometry && geoJsonData.geometry.coordinates) {
      coords = geoJsonData.geometry.coordinates[0];
    } else {
      return null;
    }
    coords.forEach(coord => {
      const LatLng = L.GeoJSON.coordsToLatLng(coord);
      coord[0] = LatLng.lat;
      coord[1] = LatLng.lng;
    });
    // @ts-ignore
    const stripes = new L.StripePattern();
    stripes.addTo(map);
    // @ts-ignore
    const bigStripes = new L.StripePattern({
      patternContentUnits: 'objectBoundingBox',
      patternUnits: 'objectBoundingBox',
      weight: 0.1,
      spaceWeight: 0.1,
      height: 0.2,
      angle: 45
    });
    bigStripes.addTo(map);
    if (coords) {
      const polygon = new L.Polygon(coords, {
        // style: {
        // @ts-ignore
        fillPattern: stripes,
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.5
        // }
      }).addTo(map);
      map.fitBounds(polygon.getBounds());
      map.setZoom(map.getZoom() - 2);
      return polygon;
    } else {
      return null;
    }
  }

  toWKT(layer: any, project: boolean) {
    let lng, lat, point;
    const coords = [];
    if (layer instanceof L.Polygon || layer instanceof L.Polyline) {
      const latlngs: any = layer.getLatLngs();
      for (let i = 0; i < latlngs.length; i++) {
        const latlngs1: any = latlngs[i];
        if (latlngs1.length) {
          for (let j = 0; j < latlngs1.length; j++) {
            if (project) {
              const latlngsProjected: any = L.Projection.SphericalMercator.project(latlngs1[j]);
              coords.push(latlngsProjected.x + ' ' + latlngsProjected.y);
            } else {
              coords.push(latlngs1[j].lng + ' ' + latlngs1[j].lat);
            }
            if (j === 0) {
              if (project) {
                const latlngsProjec: any = L.Projection.SphericalMercator.project(latlngs1[j]);
                lng = latlngsProjec.x;
                lat = latlngsProjec.y;
              } else {
                lng = latlngs1[j].lng;
                lat = latlngs1[j].lat;
              }
            }
          }
        } else {
          if (project) {
            const latlngsProjected: any = L.Projection.SphericalMercator.project(latlngs1[i]);
            coords.push(latlngsProjected.x + ' ' + latlngsProjected.y);
          } else {
            coords.push(latlngs[i].lng + ' ' + latlngs[i].lat);
          }
          if (i === 0) {
            if (project) {
              const latlngsProjec: any = L.Projection.SphericalMercator.project(latlngs[i]);
              lng = latlngsProjec.x;
              lat = latlngsProjec.y;
            } else {
              lng = latlngs[i].lng;
              lat = latlngs[i].lat;
            }
          }
        }
      }
      if (layer instanceof L.Polygon) {
        return 'POLYGON((' + coords.join(',') + ',' + lng + ' ' + lat + '))';
      } else if (layer instanceof L.Polyline) {
        return 'LINESTRING(' + coords.join(',') + ')';
      }
    } else if (layer instanceof L.Marker) {
      if (project) {
        const latlngsProjec: any = L.Projection.SphericalMercator.project(layer.getLatLng());
        point = 'POINT(' + latlngsProjec.x + ' ' + latlngsProjec.y + ')';
      } else {
        point = 'POINT(' + layer.getLatLng().lng + ' ' + layer.getLatLng().lat + ')';
      }
      return point;
    }
  }

  drawCustomMarker(map: L.Map, geoJsonStr: string, iconIdx: number, text?: string) {
    const rndIdx = (iconIdx + 1) <= 10 ? (iconIdx + 1) : 1;
    const CustomMarker = L.Icon.extend({
      options: {
        iconUrl: '../../assets/images/markers/soft/' + rndIdx + '.png',
        iconRetinaUrl: '../../assets/images/markers/soft/' + rndIdx + '@2x.png',
        shadowUrl: '../../assets/images/markers/markers-shadow@2x.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowAnchor: [10, 12],
        shadowSize: [41, 41]
      }
    });

    const jsonData = JSON.parse(geoJsonStr);

    if (jsonData) {
      const coords = jsonData.geometry.coordinates;
      const LatLng = L.GeoJSON.coordsToLatLng(coords);
      const marker = L.circleMarker(
        L.GeoJSON.coordsToLatLng([LatLng.lng, LatLng.lat]), {
          fillColor: '#ff7800',
          color: '#000',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        }
      );
      const note = text ? text : '';
      if (note) {
        marker.bindTooltip(note, {
          direction: 'right',
          permanent: true,
          opacity: 1.0
        });
      }
      // @ts-ignore
      marker.textContent = note;
      // @ts-ignore
      marker.objectType = 'circlemarker';
      return marker;
    }
  }

  getMarkerBindLabel(map: L.Map, layer, label: string) {
    layer.unbindTooltip();
    return layer.bindTooltip(label, {
      direction: 'right',
      permanent: true,
      opacity: 1.0
    });
  }

  getGeomFromCadNumberData(data: any) {
    if (data) {
      const dat: any = data;
      if (dat.features.length > 0) {
        let coords: any[] = dat.features['0'].geometry.coordinates;
        const spCoords = [];
        coords = coords[0][0];

        for (let i = 0; i < coords.length; i++) {
          const c = coords[i];
          const point = [];
          const LatLng = L.Projection.SphericalMercator.unproject(L.point(c));
          point.push(LatLng.lat);
          point.push(LatLng.lng);
          spCoords.push(point);
        }

        const polygon = L.polygon(spCoords);
        if (polygon) {
          return polygon;
        } else {
          return null;
        }
      } else {
        return null;
      }
    }
  }

  parseCoords(coordinates: any[]) {
    const coords = [...coordinates];
    // tslint:disable-next-line:one-variable-per-declaration
    const proj4 = (proj4x as any).default, spCoords = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < coords[0].length; i++) {
      const c = coords[0][i];
      const point = proj4(this.EPSG32642, this.WGS84, proj4.toPoint(c));
      spCoords.push([point.x, point.y]);
    }
    return spCoords;
  }

  parseWKTToGeometry(geomWkt: string) {
    const geometry: GeometryObject | any = WKT.parse(geomWkt);
    geometry.coordinates = geometry.coordinates.map(coordinates => {
      const coords = this.parseCoords(coordinates);
      return coords;
    });
    const geojsonFeature = this.geojsonFeatureWithGeometry(geometry);
    return geojsonFeature;
  }

  public geojsonFeatureWithGeometry(geom: GeometryObject) {
    const geojsonFeature: Feature = {
      type: 'Feature',
      properties: {},
      geometry: geom
    };
    return geojsonFeature;
  }

}

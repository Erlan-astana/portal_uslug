import {Injectable, QueryList, ViewChildren} from '@angular/core';
import * as L from 'leaflet';
import {LayersService} from './layers.service';
import { CONST } from '../config';

@Injectable({
  providedIn: 'root'
})
export class ConnectedLayerService {
  layerLst: any;
  inputs: any;

  constructor(
    private lyrSvc: LayersService,
  ) {
  }

  getConnectedLayers() {
    this.inputs = document.getElementsByClassName('leaflet-panel-layers-selector');
    this.lyrSvc.identifyLayersLst = [];
    for (let i = 0; i < this.inputs.length; i++) {
      if (this.inputs[i].checked === true) {
        const id = (this.inputs[i].layerId);
        const layer = this.getLayer(id);
        const dicLayers = CONST.LAYERS;
        console.log(layer);
        if (layer) {
          if (layer !== dicLayers.ATYRAU_AUCTION_LANDS && layer !== dicLayers.BASE_AERO_PHOTO
            && layer !== dicLayers.BASE_MAP_SCHEMA && layer !== dicLayers.OTVODY_IZHS) {
            this.lyrSvc.identifyLayersLst.push(layer);
          }
        }
      }
    }
  }

  saveLayers(control) {
    if (control._layers) {
      this.layerLst = control._layers;
    }
  }


  getLayer(id) {
    for (let i = 0; i < this.layerLst.length; i++) {
      if (this.layerLst[i] && (this.layerLst[i].layer._leaflet_id) === id) {
        if (this.layerLst[i].layer.wmsParams) {
          return this.layerLst[i].layer.wmsParams.layers;
        }
      }
    }
  }

}

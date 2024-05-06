import {ElementRef, Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import * as L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-switch-scale-control';
import '../../../libs/leaflet/fullscreen/fullscreen.min.js';
import '../../../libs/leaflet/groupedlayercontrol/leaflet.groupedlayercontrol.min.js';
import '../../../libs/leaflet/panellayerscontrol/leaflet-panel-layers.js';
import '../../../libs/leaflet/leaflet-draw-by-coordinates/leaflet-draw-by-coordinates.js';
import {mapmodel} from '../shared/models/map.model';
import {LayersService} from './layers.service';
import {ConnectedLayerService} from './connected-layer.service';
import {auth} from '../shared/models/auth.model';
import {CONST} from '../config';
import {ROLES} from '../shared/utils/constants';

import {AuthService} from './auth.service';
import {LayerTheme} from '../shared/models/layer/layer-theme.model';
import {LayerThemePermissions} from '../shared/models/layer/layer-theme-permissions.model';

const REGION_LAYERS = [
  {
    regionId: 1,
    regionName: 'город Тараз',
    baseLayers: [
      {
        nameRu: 'Вид',
        layers: []
      }
    ],
    communalLayers: [],
  }
];

@Injectable()
export class MapControlsService {
  public drawSubject = new Subject();
  public drawPolygonByCoord = new Subject();
  private showedDrawCoordPanel = null;
  userLayers: LayerTheme[] = [];
  layers: any[] = [];
  selectedLayer: any = null;
  allLayersInitialized: boolean = false;

  constructor(
    private lyrSvc: LayersService,
    private conLayerSvc: ConnectedLayerService,
    private authService: AuthService
  ) {
    this.initLocalization();
  }

  initScale(map: L.Map) {
    L.control.scale({
      imperial: false
    }).addTo(map);
  }

  initFullscreen(map: L.Map) {
    L.control.fullscreen().addTo(map);
  }

  initDraw(map: L.Map, layerOpts: any, drawOpts: any, drawObj: any = {}, colorPolygon?) {
    if (colorPolygon === null || colorPolygon === undefined) {
      colorPolygon = 'blue';
    }
    const editableLayers = layerOpts.layers;
    const CustomMarker = L.Icon.extend({
      options: {
        iconUrl: '../../../../assets/images/markers/marker-icon.png',
        iconRetinaUrl: '../../../../assets/images/markers/marker-icon-2x.png',
        shadowUrl: '../../../../assets/images/markers/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
      }
    });
    for (let i = 0; i < drawOpts.draw.length; i++) {
      const element = drawOpts.draw[i];

      if (element === 'polyline') {
        drawObj.polyline = {};
      } else {
        drawObj.polyline = false;
      }

      if (element === 'polygon') {
        drawObj.polygon = {
          allowIntersection: false, // Restricts shapes to simple polygons
          drawError: {
            color: '#e1e100',
            message: '<strong>Oh snap!<strong> you can\'t draw that!'
          },
          shapeOptions: {
            color: colorPolygon
          },
          guidelineDistance: 20,
          // shapeOptions: { color: '#bada55' },
          metric: true,
          zIndexOffset: 2000,
          repeatMode: false,
          showArea: false
          // color: 'green'
        };
      } else {
        drawObj.polygon = false;
      }

      if (element === 'rectangle') {
        drawObj.rectangle = {};
      } else {
        drawObj.rectangle = false;
      }

      if (element === 'circle') {
        drawObj.circle = drawObj.circle ? drawObj.circle : {
          shapeOptions: {
            stroke: true,
            color: 'red',
            weight: 17,
            opacity: 0.7,
            fill: true,
            fillColor: '#f03', // same as color by default
            fillOpacity: 0.5,
            clickable: true
          },
          showRadius: true,
          metric: true, // Whether to use the metric measurement system or imperial
          feet: true, // When not metric, use feet instead of yards for display
          nautic: false // When not metric, not feet use nautic mile for display
        };
      } else {
        drawObj.circle = false;
      }

      if (element === 'circlemarker') {
        drawObj.circlemarker = drawObj.circlemarker ? drawObj.circlemarker : {
          stroke: false,
          color: 'red',
          weight: 1,
          opacity: 1,
          fill: true,
          fillColor: null, // same as color by default
          fillOpacity: 0.5,
          clickable: true,
          radius: 5,
          zIndexOffset: 2000 // This should be > than the highest z-index any markers
        };
      } else {
        drawObj.circlemarker = false;
      }

      if (element === 'marker') {
        drawObj.marker = drawObj.marker ? drawObj.marker : {
          icon: new CustomMarker()
        };
      } else {
        drawObj.marker = false;
      }
    }
    const DrawOptions: any = {
      position: drawOpts.position,
      draw: drawObj,
      edit: {
        featureGroup: editableLayers, // REQUIRED!!
        edit: layerOpts.edit,
        remove: layerOpts.remove
      }
    };

    const drawControl = new L.Control.Draw(DrawOptions);
    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, (e: any) => {
      const type = e.layerType,
        layer = e.layer;

      editableLayers.addLayer(layer);
      const drawSubjObj = new mapmodel.DrawToolOpts();
      drawSubjObj.drawevent = 'drawend';
      drawSubjObj.layer = layer;
      drawSubjObj.type = type;

      this.drawSubject.next(drawSubjObj);
    });
  }

  initLocalization() {
    const drawToolbar = {
      actions: {
        title: 'Отменить рисование',
        text: 'Отменить'
      },
      finish: {
        title: 'Закончить рисование',
        text: 'Закончить'
      },
      undo: {
        title: 'Удалить последнюю нарисованную точку',
        text: 'Удалить последнюю точку'
      },
      buttons: {
        polyline: 'Нарисовать полилинию',
        polygon: 'Нарисовать полигон',
        rectangle: 'Нарисовать прямоугольник',
        circle: 'Нарисовать окружность',
        marker: 'Нарисовать маркер',
        circlemarker: 'Нарисовать круг маркер'
      }
    };

    const drawHandlers = {
      circle: {
        tooltip: {
          start: 'Нажмите и перетащите, чтобы нарисовать круг.'
        },
        radius: 'Радиус'
      },
      circlemarker: {
        tooltip: {
          start: 'Нажмите на карту, чтобы разместить круг маркер.'
        }
      },
      marker: {
        tooltip: {
          start: 'Нажмите на карту, чтобы разместить маркер.'
        }
      },
      polygon: {
        error: '<strong>Ошибка:</strong>!',
        tooltip: {
          start: 'Нажмите, чтобы начать рисовать фигуру.',
          cont: 'Нажмите, чтобы продолжить рисование фигуры.',
          end: 'Нажмите первую точку, чтобы замкнуть эту фигуру.'
        }
      },
      polyline: {
        error: '<strong>Ошибка:</strong> края формы не могут пересекаться!',
        tooltip: {
          start: 'Нажмите, чтобы начать рисовать линию.',
          cont: 'Нажмите, чтобы продолжить рисование линию.',
          end: 'Нажмите последнюю точку для завершения линии.'
        }
      },
      rectangle: {
        tooltip: {
          start: 'Нажмите и перетащите, чтобы нарисовать прямоугольник.'
        }
      },
      simpleshape: {
        tooltip: {
          end: 'Отпустите мышь, чтобы закончить рисование.'
        }
      }
    };

    const editToolbar = {
      actions: {
        save: {
          title: 'Сохранить изменения.',
          text: 'Сохранить'
        },
        cancel: {
          title: 'Отмена редактирования, сбрасывает все изменения.',
          text: 'Отмена'
        },
        clearAll: {
          title: 'Очистить все слои.',
          text: 'Очистить все'
        }
      },
      buttons: {
        edit: 'Изменить слои.',
        editDisabled: 'Нет слоев для редактирования.',
        remove: 'Удалить слои.',
        removeDisabled: 'Нет слоев для удаления.'
      }
    };

    const editHandlers = {
      edit: {
        tooltip: {
          text: 'Перетащите ручки или маркер для редактирования.',
          subtext: 'Нажмите «Отмена», чтобы отменить изменения.'
        }
      },
      remove: {
        tooltip: {
          text: 'Нажмите на объект, чтобы удалить'
        }
      }
    };

    (L as any).drawLocal.draw.toolbar = drawToolbar;
    (L as any).drawLocal.draw.handlers = drawHandlers;
    (L as any).drawLocal.edit.toolbar = editToolbar;
    (L as any).drawLocal.edit.handlers = editHandlers;
  }


  private getWmsTileLayer(layer: string) {
    return L.tileLayer.wms(CONST.CONFIG.GEOSERVER_URL + `utilities/wms?service=WMS`, {
      layers: layer, format: 'image/png', transparent: true, version: '1.1.0', maxZoom: 21, minZoom: 7
    });
  }

  // слои из  Геопортала Атырауской области
  public getWmsTileLayerCity(layer: string, url: string) {
    url = url ? url + 'wms' : CONST.CONFIG.GEOSERVER_ATYRAU_URL;
    return L.tileLayer.wms(url, {
      layers: layer, format: 'image/png', transparent: true, version: '1.1.0', maxZoom: 21, minZoom: 7
    });
  }


  initExtractWKTControl(map: L.Map) {
    const container: any = L.DomUtil.create('input', 'wkt-extract');
    const extrWKTControl = L.Control.extend({
      options: {position: 'topright'},
      onAdd: (mapp) => {
        container.type = 'button';
        container.title = 'Показать WKT';
        container.value = 'WKT';
        container.style.height = '30px';
        container.style.width = 'auto';
        container.style.backgroundColor = 'rgb(255, 255, 255)';
        container.style.borderRadius = '2px';
        container.style.cursor = 'pointer';
        container.style.borderColor = 'rgb(204, 204, 204)';
        L.DomEvent.addListener(container, 'click', L.DomEvent.stopPropagation);
        return container;
      },
    });
    map.addControl(new extrWKTControl());
    return container;
  }

  initFitCurrLocationControl(map: L.Map) {
    const container: any = L.DomUtil.create('input', 'currLoc-extract');
    // L.DomUtil.setOpacity( container, 1.0 );
    const extrCurrLocControl = L.Control.extend({
      options: {
        position: 'topleft'
      },
      onAdd: (mapp) => {
        container.type = 'button';
        container.title = 'Выбранный участок';
        container.style.height = '35px';
        container.style.width = '35px';
        container.style.backgroundColor = 'rgb(255, 255, 255)';
        container.style.borderRadius = '3px';
        container.style.cursor = 'pointer';
        container.style.borderColor = 'rgb(204, 204, 204)';
        container.style.backgroundImage = 'url(../../../../assets/images/markers/icon-currLoc-32.png)';

        L.DomEvent.addListener(container, 'click', L.DomEvent.stopPropagation);
        return container;
      },
    });
    map.addControl(new extrCurrLocControl());
    return container;
  }

  initMapScaleControl(map: L.Map) {
    const options = {
      position: 'bottomleft',
      dropdownDirection: 'upward',
      className: 'map-control-scalebar',
      updateWhenIdle: false,
      ratio: true,
      ratioPrefix: '1:',
      ratioCustomItemText: '1: другой...',
      customScaleTitle: 'Задайте свой масштаб и нажмите Enter',
      recalcOnPositionChange: false,
      recalcOnZoomChange: false,
      scales: [
        500, 1000, 2000, 5000
      ],
      roundScales: undefined,
      adjustScales: false,
      pixelsInMeterWidth: function () {
        const div = document.createElement('div');
        div.style.cssText = 'position: absolute;  left: -100%;  top: -100%;  width: 100cm;';
        document.body.appendChild(div);
        const px = div.offsetWidth;
        document.body.removeChild(div);
        return px;
      },
      getMapWidthForLanInMeters: function (currentLan) {
        return 6378137 * 2 * Math.PI * Math.cos(currentLan * Math.PI / 180);
      }
    };
    // @ts-ignore
    map.addControl(new L.Control.SwitchScaleControl(options));
    const dropdown = document.querySelector('.map-control-scalebar-dropdown') as HTMLElement;
    dropdown.style.backgroundColor = '#fffffff';
    dropdown.style.visibility = 'hidden';

    const dropdownItem = document.querySelectorAll('.map-control-scalebar-scale-item') as any;
    for (let i = 0; i < dropdownItem.length; i++) {
      dropdownItem[i].style.borderBottom = '1px solid #000000';
      dropdownItem[i].style.background = '#ffffff';
      dropdownItem[i].style.padding = '2px 5px';
    }

    const customScale = document.querySelector('.map-control-scalebar-custom-scale') as HTMLElement;
    customScale.style.backgroundColor = 'white';
    customScale.style.cursor = 'text';
    customScale.style.border = '2px groove #d9d9d9';
    customScale.style.display = 'none'; // inline-block
    // -webkit-appearance: textfield;

    const scalebarText = document.querySelector('.map-control-scalebar-text') as HTMLElement;
    scalebarText.style.height = '15px';
    scalebarText.style.width = '54px';
    scalebarText.style.border = '2px solid #777';
    scalebarText.style.borderTop = 'none';
    scalebarText.style.padding = '2px 5px 1px';
    scalebarText.style.background = 'rgba(255, 255, 255, 0.7)';
    scalebarText.addEventListener('click', function (event) {
      if (scalebarText.classList.contains('showed')) {
        scalebarText.classList.remove('showed');
        dropdown.style.visibility = 'hidden';
      } else {
        scalebarText.classList.add('showed');
        dropdown.style.visibility = 'visible';
        dropdown.style.maxHeight = '28em';
      }
    });

    dropdown.addEventListener('click', function (event) {
      const target = event.target;
      // @ts-ignore
      if (target && target.classList.contains('map-control-scalebar-scale-item')) {
        for (let i = 0; i < dropdownItem.length; i++) {
          if (target === dropdownItem[i]) {
            dropdown.style.visibility = 'hidden';
            scalebarText.classList.remove('showed');
          }
        }
      }
    });
  }

  initMapHidePolygonControl(map: L.Map, currPolygon?) {
    const hide = new L.Control({position: 'bottomleft'});
    hide.onAdd = function () {
      const div = L.DomUtil.create('div', 'hide');

      div.innerHTML = '<input id="hide" checked="false" type="checkbox" style="width: 30px; height: 30px"/>';
      return div;
    };
    hide.addTo(map);

    document.getElementById('hide').addEventListener('click', function (e) {
      // @ts-ignore
      if (this.checked === false) {
        if (currPolygon) {
          map.removeLayer(currPolygon);
        }
      } else {
        map.addLayer(currPolygon);
      }
    });
  }

  initPopupControl(map: L.Map) {
    const el: any = document.querySelector('.popup-extract');
    if (el) {
      L.DomUtil.remove(el);
    }
    const container: any = L.DomUtil.create('input', 'popup-extract');
    const extrPopupControl = L.Control.extend({
      options: {
        position: 'bottomright'
      },
      onAdd: (mapp) => {
        container.type = 'button';
        container.title = 'Tiles';
        container.style.height = '35px';
        container.style.width = '35px';
        container.style.backgroundColor = 'rgb(255, 255, 255)';
        container.style.borderRadius = '3px';
        container.style.cursor = 'pointer';
        container.style.borderColor = 'rgb(204, 204, 204)';
        container.style.backgroundImage = 'url(../../../../assets/images/layers32.png)';

        L.DomEvent.addListener(container, 'click', L.DomEvent.stopPropagation);
        return container;
      },
    });
    map.addControl(new extrPopupControl());
    return container;
  }

  initUncheckLayersControl(map: L.Map) {
    const container: any = L.DomUtil.create('input', 'currLoc-extract');
    // L.DomUtil.setOpacity( container, 1.0 );
    const extrCurrLocControl = L.Control.extend({
      options: {
        position: 'bottomright'
      },
      onAdd: (mapp) => {
        container.type = 'button';
        container.title = 'Снять все слои';
        container.style.height = '35px';
        container.style.width = '35px';
        container.style.backgroundColor = 'rgb(255, 255, 255)';
        container.style.borderRadius = '3px';
        container.style.cursor = 'pointer';
        container.style.borderColor = 'rgb(204, 204, 204)';
        container.style.backgroundImage = 'url(../../../../assets/images/markers/icon-currLoc-32.png)';

        L.DomEvent.addListener(container, 'click', L.DomEvent.stopPropagation);
        return container;
      },
    });
    map.addControl(new extrCurrLocControl());
    return container;
  }

  panelLayersControl(map: L.Map, userInfo, roles?) {
    const el = document.querySelector('.leaflet-control-layers-expanded');
    if (el) {
      if (el.classList.contains('hidden')) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    } else {
      this.initPanelLayersControl(map, userInfo, roles);
    }
  }

  private initPanelLayersControl(map: L.Map, userInfo: auth.User, roles?) {
    let overlays = [];
    const baseMap = [];

    const baseLayers = {
      group: 'Вид',
      collapsed: true,
      layers: [
        {
          name: 'Гибрид',
          layer: this.lyrSvc.googleHybridLayer
        },
        {
          name: 'Схема',
          layer: this.lyrSvc.googleRoadLayer
        }
      ]
    };

    baseMap.push(baseLayers);
    if (roles.some(e => e === ROLES.DUTY_MAP || e === ROLES.OZO || e === ROLES.GEO_TAX)) {
      overlays = [...overlays, ...this.initLayersByRegionId(userInfo.organization.regionId, 'communalLayers')];
    }

    const options = {
      position: 'bottomright',
      collapsibleGroups: true
    };
    const layerControl = L.control.panelLayers(baseMap, overlays, options);
    layerControl.addTo(map);

    this.conLayerSvc.saveLayers(layerControl);
    return layerControl;
  }


  initLayersByRegionId(regionId: number, layerType: string) {
    const overlays = [];
    const region = REGION_LAYERS.find(reg => reg.regionId === 1);
    if (region[layerType] && region[layerType]) {
      for (let i = 0; i < region[layerType].length; i++) {
        const element = region[layerType][i];
        overlays.push(this.initLayers(element, true));
      }
    }
    return overlays;
  }

  initLayers(layerType: any, isCity: boolean) {
    const layerOverlays = {
      group: layerType.nameRu,
      collapsed: true,
      layers: []
    };
    if (layerType.layers) {
      for (let i = 0; i < layerType.layers.length; i++) {
        const layer = {
          name: layerType.layers[i].name,
          layerId: layerType.layers[i].layerId,
          layer: isCity ? this.getWmsTileLayerCity(layerType.layers[i].layer, layerType.layers[i].url)
            : this.getWmsTileLayer(layerType.layers[i].layer)
        };
        layerOverlays.layers.push(layer);
      }
    }
    return layerOverlays;
  }

  initDrawByCoordControl(map: L.Map) {
    const drawToolBtn: any = L.DomUtil.create('input', 'draw-by-coordinates-tool');
    const drawToolControl = L.Control.extend({
      options: {position: 'topright'},
      onAdd: (mapp) => {
        drawToolBtn.type = 'button';
        drawToolBtn.title = 'Координаты';
        drawToolBtn.style.height = '35px';
        drawToolBtn.style.width = '35px';
        drawToolBtn.style.backgroundColor = 'rgb(255, 255, 255)';
        drawToolBtn.style.backgroundImage = 'url(../../assets/images/xy-15.svg)';
        drawToolBtn.style.borderColor = 'rgb(204, 204, 204)';
        drawToolBtn.style.borderRadius = '3px';
        drawToolBtn.style.cursor = 'pointer';

        L.DomEvent.addListener(drawToolBtn, 'click', L.DomEvent.stopPropagation);
        return drawToolBtn;
      }
    });
    map.addControl(new drawToolControl());
    return drawToolBtn;
  }

  initDrawByCoordPanel(map: L.Map) {
    if (this.showedDrawCoordPanel) {
      map.removeControl(this.showedDrawCoordPanel);
      this.showedDrawCoordPanel = null;
    } else {
      // @ts-ignore
      this.showedDrawCoordPanel = new L.Control.ToolPanel({data: null});
      map.addControl(this.showedDrawCoordPanel);
      console.log(this.showedDrawCoordPanel);
      const controlPanel = this.showedDrawCoordPanel;
      const drawPolygonSub = this.drawPolygonByCoord;
      document.querySelector('.geom-coords-calculate').addEventListener('click', function () {
        controlPanel.calculate();

        if (controlPanel._polygon) {
          drawPolygonSub.next(controlPanel._polygon);
          controlPanel._polygon.addTo(map);
          map.fitBounds(controlPanel._polygon.getBounds());
        }
      });
    }
  }

  hideControls(hide: boolean) {
    const controls = document.getElementsByClassName('leaflet-control');
    for (let i = 0; i < controls.length; i++) {
      const item: any = controls[i];
      if (item.classList.contains('leaflet-control-scale')) {
        continue;
      }
      item.style.display = hide ? 'none' : 'block';
    }
  }

  initializeTree(treeData, rootLyrId = null, rootInit = false) {
    // Build the tree nodes from Json object. The result is a list of `LayerItemNode` with nested
    //     file node as children.
    const data = this.buildFileTree(treeData, rootLyrId, rootInit);
    data.sort((a, b) => a.orderId - b.orderId);
    if (data.length > 0) {
      // Notify the change.
      return data;
    }
  }

  public buildFileTree(arr, parentId?, rootInit = false) {
    const treeArray = [];
    for (const item in arr) {
      if (arr.hasOwnProperty(item) && arr[item].parentId === parentId) {
        const children = this.buildFileTree(arr, arr[item].id, rootInit);
        if (children.length) {
          arr[item].children = children;
        }
        treeArray.push(arr[item]);
      }
    }
    return treeArray;
  }

  public getLayersFromLayerChilds(childs, regLayer) {
    if (Array.isArray(childs)) {
      const layers = [];
      childs.forEach(child => {
        if (child.source) {
          layers.push({
            name: child.nameRu,
            layer: child.layerName,
            layerId: child.id,
            url: child.source.url
          });
        } else {
          this.getLayersFromLayerChilds(child.children, regLayer);
        }
      });
      if (layers.length) {
        regLayer.layers = [...regLayer.layers, ...layers];
      }
    }
  }

  public async fetchLayerThemes() {
    if (this.userLayers.length <= 0) {
      this.lyrSvc.getUserLayerTreeParent(this.authService.currentUser.id).subscribe(response => {
        if (response) {
          this.userLayers = response;
          this.setUserLayers(this.userLayers);
        }
      });
    } else {
      this.setUserLayers(this.userLayers);
    }
  }

  setUserLayers(response) {
    const rootLyrIds = [40017, 40018, 40019, 40022];
    rootLyrIds.forEach(rootLyrId => {
      const layers = this.initializeTree(response, rootLyrId, true);
      const regLayers = [];
      if (layers && Array.isArray(layers)) {
        layers.forEach((layer, index) => {
          regLayers.push({
            nameRu: layer.nameRu,
            layers: []
          });
          this.getLayersFromLayerChilds(layer.children, regLayers[regLayers.length - 1]);
        });
        REGION_LAYERS[0].communalLayers = [...REGION_LAYERS[0].communalLayers, ...regLayers];
      }
      if (rootLyrId === 40022) {
        this.allLayersInitialized = true;
      }
    });
  }

  setSelectedLayer(layer: any) {
    this.selectedLayer = (this.userLayers.filter((item) => item.id === layer.layerId));
  }

}

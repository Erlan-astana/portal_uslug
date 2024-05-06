
import {Geoserver} from './geoserver';
import {LayerTheme} from './layer-theme.model';


export class LayerGroup {
    id: number;
    layerGroupId: number;
    layerGroupName: string;
    layerLegendId: number;
    layerOrderId: number;
    layerTheme: LayerTheme;
    legendImageUrl: string;
    nameEn: string;
    nameKk: string;
    nameRu: string;
    geoserver: Geoserver;
    needAuthorization: boolean;
    orderId: number;
    addressId: number;
    analyzeModal: string;
    config: string;
    hasAnalyze: boolean;
    hasChild: boolean;
    hasInfo: boolean;
    type: string;
    zIndex: number;
    active?: boolean;
    edit?: boolean;
    description?: string;
    bbox?: string;
    focusBtnEnabled?: boolean;
}

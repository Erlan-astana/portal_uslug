import * as L from 'leaflet';

declare module 'leaflet' {

    namespace control {
        function fullscreen();
        function groupedLayers(baseLayers: any, groupedOverlays: any, options: any);
        function panelLayers(baseLayers: any, groupedOverlays: any, options: any);
    }

}

import {LayerTheme} from './layer-theme.model';


export interface LayerThemePermissions {
  id: number;
  layerTheme: LayerTheme;
  userId: number;
  permission: string;
}


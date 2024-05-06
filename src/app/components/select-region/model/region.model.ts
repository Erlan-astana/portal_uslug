export interface Region {
  id: number;
  nameEn: string;
  nameKk: string;
  nameRu: string;
  children?: Region[];
}

export interface ExampleRegionNode {
  expandable: boolean;
  level: number;
  id: number;
  nameRu: string;
}

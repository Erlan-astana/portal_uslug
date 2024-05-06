import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material';
import {ExampleRegionNode, Region} from './model/region.model';
import {DicApplicationService} from '../../services/dic.application.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {AdminService} from "../../services/admin.service";
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-select-region',
  templateUrl: './select-region.component.html',
  styleUrls: ['./select-region.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SelectRegionComponent implements OnInit, OnDestroy {
  @Output() setSelectedRegionId = new EventEmitter<any>();
  @Input() subserviceId;
  private _transformer = (node: Region, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      nameRu: node.nameRu,
      nameKk: node.nameKk,
      id: node.id,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<ExampleRegionNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  regions: Region[] = [];
  selectedRegion = null;
  selectedRegionId = null;
  currentRegionId: number = null;
  destroyed$ = new Subject();
  currentLang: string;

  constructor(
    private dicSvc: DicApplicationService,
    public translate: TranslateService
  ) {
  }

  ngOnInit() {
    this.getRegions();
    this.currentLang = this.translate.currentLang ? this.translate.currentLang : this.translate.getDefaultLang();
    this.translate.onLangChange.pipe(takeUntil(this.destroyed$))
      .subscribe((event: any) => {
        this.currentLang = event.lang;
      });
  }

  getRegions() {
    this.dicSvc.getRegions().then((data: Region[]) => {
      this.regions = this.removeChilds(data);
      this.prepareRegions(this.regions);
      //this.regions = this.regions.filter(region => region.children.length > 0);
      this.dataSource.data = this.regions;
      if (!this.selectedRegion) {
        this.setCurrentRegionById(this.currentRegionId);
      }
    });
  }

  removeChilds(regions: Region[]) {
    if (!this.subserviceId) {
      regions.forEach((region, index) => {
        if (index !== 0) {
          region.children = [];
        }
      });
    }
    return regions;
  }

  public prepareRegions(regions) {
    if (this.subserviceId) {
      regions.forEach((region) => {
        const newRegion = Object.assign({}, region);
        newRegion.children = null;
        if (region.children && region.children.length) {
          if (!region.children.some(child => child.id === newRegion.id)) {
            region.children.unshift(newRegion);
            this.prepareRegions(region.children);
          }
        }
      });
    }
  }

  public saveSelectedRegion(region: Region) {

    this.selectedRegion = region;
    this.selectedRegionId = region.id;
    this.setSelectedRegionId.emit(this.selectedRegionId);
  }

  public setCurrentRegionById(regionId) {
    this.currentRegionId = regionId;
    if (regionId && this.regions.length > 0) {
      const currentRegion = this.dicSvc.getRegionById(this.regions, regionId);
      if (currentRegion) {
        this.saveSelectedRegion(currentRegion);
      }
    }
  }

  hasChild = (_: number, node: ExampleRegionNode) => node.expandable;

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

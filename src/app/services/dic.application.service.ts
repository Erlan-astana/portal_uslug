import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiService} from '../services/api.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {Region} from '../components/select-region/model/region.model';

@Injectable()
export class DicApplicationService implements OnDestroy {
  destroyed$ = new Subject();
  regions: Region[] = [];

  constructor(private http: HttpClient,
              private api: ApiService) {
  }

  public getRegions() {
    return new Promise((resolve, reject) => {
      if (this.regions.length) {
        resolve(this.regions);
      } else {
        this.api.get('dict/regions', {}, false).pipe(takeUntil(this.destroyed$))
          .subscribe((res: Region[]) => {
            this.regions = res;
            resolve(res);
          }, error1 => reject(error1));
      }
    });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public getPhasesReq() {
    return this.api.get('dict/phases');
  }

  public getPhasesPeriodsReq() {
    return this.api.get('dict/phase-periods');
  }

  public getServiceReq() {
    return this.api.get('dict/services', {}, false);
  }

  public getAllSubServiceReq() {
    return this.api.get2('users/subservices', {});
  }

  public getSubservicesByServiceId(serviceId) {
    return this.api.get('dict/subservices?serviceId=' + serviceId, {}, false);
  }

  public getAppFileCategories(subserviceId) {
    return this.api.get('dict/file-types?subserviceId=' + subserviceId);
  }

  public changeAppFileCategories(appFileCategories) {
    appFileCategories.map((obj) => {
      obj.categoryFiles = [];
      obj.categoryFilesUpload = [];
      return obj;
    });
    return appFileCategories;
  }

  public getDisctrictsReq() {
    return this.api.get('dict/districts');
  }

  public getRegionsReq() {
    return this.api.get('dict/regions', {}, false);
  }

  public getRegionById(regions, regionId) {
    const BreakException = {};
    let region = null;
    try {
      if (regionId !== null && regionId !== undefined && regions.length > 0) {
        regions.forEach((reg) => {
          if (reg.id === regionId) {
            region = reg;
            throw BreakException;
          }
          if (reg.children.length) {
            reg.children.forEach(child => {
              if (child.id === regionId) {
                region = child;
                throw BreakException;
              }
              if (child.children && child.children.length) {
                child.children.forEach(ch => {
                  if (ch.id === regionId) {
                    region = ch;
                    throw BreakException;
                  }
                });
              }
            });
          }
        });
      }
    } catch (e) {
      if (e !== BreakException) {
        throw e;
      }
    }
    if (region) {
      return region;
    }
  }
}

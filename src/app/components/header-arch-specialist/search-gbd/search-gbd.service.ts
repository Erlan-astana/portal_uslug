import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {CONST} from '../../../config';
import CONFIG = CONST.CONFIG;

@Injectable()
export class SearchGbdService {
  token = localStorage.getItem('access_token');
  headers = new HttpHeaders({
    'Authorization': 'Bearer ' + this.token,
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) {
  }


  public getIndividual(iin: string): Observable<any> {
    const url = CONFIG.GEO_INTEGRATION_API + `persons/byiin`;
    const body = {"data": iin, "systemName": "portal", "serviceName": "fl"};
    return this.http.post(url, body, {headers: this.headers});
  }

  public getEntity(iinOrBiin: string): Observable<any> {
    const url = CONFIG.GEO_INTEGRATION_API + `faces/bybin`;
    const body = {"data": iinOrBiin, "systemName": "portal", "serviceName": "fl"};
    return this.http.post(url, body, {headers: this.headers});
  }

  public getRealties(type: string, iinOrBiin: string): Observable<any> {
    const url = CONFIG.GEO_INTEGRATION_API + `realties/${type}`;
    const body = {"data": iinOrBiin, "systemName": "portal", "serviceName": "fl"};
    return this.http.post(url, body, {headers: this.headers});
  }

  public getZags(zagsType: string, searchType: string, input: string): Observable<any> {
    const url = CONFIG.GEO_INTEGRATION_API + `zags/${zagsType}/${searchType}`;
    const body: any = {'data': input, "systemName": "portal", "serviceName": "fl"};
    return this.http.post(url, body, {headers: this.headers});
  }
}

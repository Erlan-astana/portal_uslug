import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CONST} from '../config';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {
  }

  public getWithoutAuth(url: string, parms?): Observable<any> {
    return this.http.get(url, {
      params: parms,
    });
  }

  public get(restPath: string, parms?, auth = true): Observable<any> {
    const url: string = CONST.CONFIG.SERVICES_URL + restPath;
    return this.http.get(url, {
      params: parms,
    });
  }

  public getWithAuth(restPath: string, parms?, auth = true): Observable<any> {
    return this.http.get(restPath, {
      params: parms,
    });
  }

  public post_auth(restPath: string, body: any = null, parms?, auth: boolean = true): Observable<any> {
    const url: string = CONST.CONFIG.AUTH_URL + restPath;
    const headers = auth ? {
      'Content-Type': 'application/json'
    } : {};
    return this.http.post<any>(url, body, {
      headers: new HttpHeaders(headers),
      observe: 'response',
      params: parms
    });
  }

  public get2(restPath: string, parms?, auth = true): Observable<any> {
    const url: string = CONST.CONFIG.SERVICES_URL_2 + restPath;
    return this.http.get(url, {
      params: parms,
    });
  }

 /* public getArrayBuffer(url_path: string, params: any = null): Observable<HttpResponse<any>> {
    const url: string = CONST.CONFIG.SERVICES_URL_2 + url_path;
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.get<any>(url, {
      responseType: 'blob' as 'json',
    });
  }*/

  public getArrayBuffer(url_path: string): Observable<HttpResponse<any>> {
    const url: string = CONST.CONFIG.SERVICES_URL_2 + url_path;
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get<any>(url, {
      responseType: 'blob' as 'json',
      headers: httpHeaders
    });
  }

  public post(url_path: string, body: any = null, parms?, auth = true): Observable<HttpResponse<any>> {
    const url: string = CONST.CONFIG.SERVICES_URL + url_path;
    const headers = auth ? {
      'Content-Type': 'application/json'
    } : {};
    return this.http.post<any>(url, body, {
      headers: new HttpHeaders(headers),
      observe: 'response',
      params: parms
    });
  }

  public post2(url_path: string, body: any = null, parms?, auth = true): Observable<HttpResponse<any>> {
    const url: string = CONST.CONFIG.SERVICES_URL_2 + url_path;
    const headers = auth ? {
      'Content-Type': 'application/json'
    } : {};
    return this.http.post<any>(url, body, {
      headers: new HttpHeaders(headers),
      observe: 'response',
      params: parms
    });
  }

  public POST_INTGN_API(restPath: string, body: object, parms?, auth = true): Observable<any> {
    const url: string = CONST.CONFIG.GEO_INTEGRATION_API + restPath;
    const token = localStorage.getItem('access_token');
    const headers = auth ? {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    } : {};
    return this.http.post(url, body, {
      headers: new HttpHeaders(headers),
      params: parms,
    });
  }

  public postArrayBuffer(url_path: string, body: any = null, params: any = null, auth = true): Observable<HttpResponse<any>> {
    const url: string = CONST.CONFIG.SERVICES_URL_2 + url_path;
    const headers = auth ? {
      'Content-Type': 'application/json'
    } : {};
    return this.http.post<any>(url, body, {
      headers: new HttpHeaders(headers),
      responseType: 'blob' as 'json',
    });
  }

  public put(url_path: string, body: any, params: any = null): Observable<HttpResponse<any>> {
    const url: string = CONST.CONFIG.SERVICES_URL + url_path;
    return this.http.put<any>(url, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      observe: 'response'
    });
  }

  public put2(url_path: string, body: any, params: any = null): Observable<HttpResponse<any>> {
    const url: string = CONST.CONFIG.SERVICES_URL_2 + url_path;
    return this.http.put<any>(url, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      observe: 'response'
    });
  }

  public delete(restPath: string, parms?): Observable<any> {
    const url: string = CONST.CONFIG.SERVICES_URL_2 + restPath;
    return this.http.delete(url, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      params: parms,
      observe: 'response'
    });
  }


}

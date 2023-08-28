import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from '../app.service';
import { AppSettings } from '../app-setting';
import { HttpResponse } from './http-response';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private apiPrefixDefault: string = AppSettings.apiDefaultPrefix;
  private headerDefault!: HttpHeaders 

  constructor(private httpClient: HttpClient, private appService: AppService) { 
    this.appService.getSessionIdObservable().subscribe(
      (sessionId) => {
        this.headerDefault = new HttpHeaders(
          {
            'sessionId': sessionId
          }
        )
      }
    )
  }

  get(url: string, httpParams?: HttpParams): Observable<HttpResponse> {
    return this.httpClient.get<HttpResponse>(`${this.apiPrefixDefault}/${url}`, {
      params: httpParams,
      headers: this.headerDefault
    });
  }

  post(url: string, body: any, httpParams?: HttpParams): Observable<HttpResponse> {
    return this.httpClient.post(`${this.apiPrefixDefault}/${url}`, body, {
      params: httpParams,
      headers: this.headerDefault
    });
  }

  put(url: string, body: any, pathVariable: string, httpParams?: HttpParams): Observable<HttpResponse> {
    return this.httpClient.put(`${this.apiPrefixDefault}/${url}/${pathVariable}`, body, {
      params: httpParams,
      headers: this.headerDefault
    });
  }

  download(method: 'GET' | 'POST' | 'PUT', url: string, body?: any, httpParams?: HttpParams): Observable<Blob> {
    switch (method) {
      case 'POST':
        return this.httpClient.post(`${this.apiPrefixDefault}/${url}`, body, {
          params: httpParams,
          responseType: 'blob',
          headers: this.headerDefault
        });

      case 'PUT':
        return this.httpClient.put(`${this.apiPrefixDefault}/${url}`, body, {
          params: httpParams,
          responseType: 'blob',
          headers: this.headerDefault
        });
        
      default:
        return this.httpClient.get(`${this.apiPrefixDefault}/${url}`, {
          params: httpParams,
          responseType: 'blob',
          headers: this.headerDefault
        });
    }
  }
}

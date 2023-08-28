import { Injectable } from "@angular/core";
import { HttpService } from "src/app/http/http.service";
import { Observable } from 'rxjs';
import { HttpResponse } from '../../http/http-response';

@Injectable({
    providedIn: 'root'
}) export class ApiAuthorizationService{

    constructor(private http: HttpService){}

    getListEndpoint(): Observable<HttpResponse> {
        return this.http.get('adm-endpoint');
    }

    getListEndpointModul(): Observable<HttpResponse> {
        return this.http.get('adm-endpoint-modul');
    }

    saveEndpoint(data: object): Observable<HttpResponse> {
        return this.http.post('adm-endpoint', data);
    }

    editEndpoint(data: object, id: string): Observable<HttpResponse> {
        return this.http.put('adm-endpoint', data, id);
    }

    deleteBatchEndpoint(data: object): Observable<HttpResponse> {
        return this.http.post('adm-endpoint/delete', data);
    }

}
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse } from '../http/http-response';
import { HttpService } from '../http/http.service';
import { MenuStructure } from './menu-structure';

@Injectable({
  providedIn: 'root'
})
export class MenuStructureService {

  constructor(private http: HttpService) { }

  getParentAndChildMenuStructures(url:string, menuStructures: MenuStructure[]): Observable<HttpResponse> {
    return this.http.post(url, menuStructures);
  }

  downloadMenuInfoTS(url: string, menuStructures: MenuStructure[]): Observable<HttpResponse> {
    return this.http.post(`${url}/file`, menuStructures);
    // return this.http.download('POST', 'mst-menu-structure/file', menuStructures);
  }

}

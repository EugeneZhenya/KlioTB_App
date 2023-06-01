import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../Interfaces/response-api';
import { Language } from '../Interfaces/language';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private urlApi: string = environment.endPoint + "/api/Languages/";

  constructor(private http: HttpClient) { }

  list(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}List`)
  }

  create(request: Language): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlApi}New`, request)
  }

  edit(request: Language): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(`${this.urlApi}Update`, request)
  }

  delete(id: number): Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${this.urlApi}Remove/${id}`)
  }
}

import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../Interfaces/response-api';
import { Country } from '../Interfaces/country';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private urlApi: string = environment.endPoint + "/api/Countries/";

  constructor(private http: HttpClient) { }

  list(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}List`)
  }

  create(request: Country): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlApi}New`, request)
  }

  edit(request: Country): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(`${this.urlApi}Update`, request)
  }

  delete(id: number): Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${this.urlApi}Remove/${id}`)
  }
}

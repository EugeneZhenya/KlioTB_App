import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../Interfaces/response-api';
import { Login } from '../Interfaces/login';
import { User } from '../Interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private urlApi: string = environment.endPoint + "/api/Users/";

  constructor(private http: HttpClient) { }

  initSession(request: Login): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlApi}InitialSession`, request)
  }

  list(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}List`)
  }

  create(request: User): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlApi}New`, request)
  }

  edit(request: User): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(`${this.urlApi}Update`, request)
  }

  delete(id: number): Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${this.urlApi}Remove/${id}`)
  }
}

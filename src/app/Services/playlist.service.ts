import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../Interfaces/response-api';
import { PlaylistChannel } from '../Interfaces/playlist-channel';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private urlApi: string = environment.endPoint + "/api/Playlist/";

  constructor(private http: HttpClient) { }

  get(id: number): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}Get/${id}`)
  }

  create(request: PlaylistChannel[]): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlApi}Generate`, request)
  }
}

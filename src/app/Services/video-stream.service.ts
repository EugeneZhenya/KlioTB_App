import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../Interfaces/response-api';
import { VideoStream } from '../Interfaces/video-stream';

@Injectable({
  providedIn: 'root'
})
export class VideoStreamService {
  private urlApi: string = environment.endPoint + "/api/VideoStreams/";

  constructor(private http: HttpClient) { }

  get(id: number): Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${this.urlApi}Get/${id}`)
  }

  create(request: VideoStream): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlApi}New`, request)
  }

  edit(request: VideoStream): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(`${this.urlApi}Update`, request)
  }

  delete(id: number): Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${this.urlApi}Remove/${id}`)
  }
}

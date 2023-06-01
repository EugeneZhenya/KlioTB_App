import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../Interfaces/response-api';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private urlApi: string = environment.endPoint + "/api/Images/";

  constructor(private http: HttpClient) { }

  upload(file: File): Observable<ResponseApi> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    return this.http.post<ResponseApi>(`${this.urlApi}Upload`, formData, {
      reportProgress: true
    });
  }

  getFiles(): Observable<any> {
    return this.http.get<ResponseApi>(`${this.urlApi}GetList`);
  }
}

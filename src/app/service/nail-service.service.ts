import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from '../common/constants';
import { NailService } from '../model/nail-service.model';

@Injectable({
  providedIn: 'root'
})
export class NailServiceService {

  private apiUrl = Constants.SERVICE_URL; 

  constructor(private http: HttpClient) {
    
  }

  getNailServices() : Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  addService(service: NailService): Observable<NailService> {
    return this.http.post<NailService>(this.apiUrl, service);
  }

  updateService(id: number, nailService: NailService): Observable<NailService> {
    return this.http.put<NailService>(`${this.apiUrl}/${id}`, nailService);
  }

  deleteService(id: number): Observable<any> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

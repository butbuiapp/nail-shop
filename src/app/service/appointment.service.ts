import { Injectable } from "@angular/core";
import { Constants } from "../common/constants";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { AppointmentRequest, AppointmentResponse, AppointmentSearch } from "../model/appointment.model";

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = Constants.APPOINTMENT_URL;

  constructor (private http: HttpClient) {}

  getAppointmentById(appointmentId: number) : Observable<AppointmentResponse> {
    return this.http.get<any>(`${this.apiUrl}/${appointmentId}`);
  }

  getAppointmentsByCustomerId(customerId: number) : Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/customer/${customerId}`);
  }

  getAppointmentsByCustomerPhone(phoneNumber: string) : Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/customer/phone/${phoneNumber}`);
  }

  searchAppointmentsByDate(appointmentSearch: AppointmentSearch) : Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/search`, appointmentSearch);
  }

  createAppointment(appointment: AppointmentRequest) : Observable<any> {
    return this.http.post<any>(this.apiUrl, appointment);
  }

  cancelAppointment(appointmentId: number) : Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${appointmentId}/cancel`);
  }

  completeAppointment(appointmentId: number) : Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${appointmentId}/complete`);
  }

  updateAppointment(appointmentId: number, appointment: AppointmentRequest) : Observable<any> {
    return this.http.put<AppointmentRequest>(`${this.apiUrl}/${appointmentId}`, appointment);
  }

}
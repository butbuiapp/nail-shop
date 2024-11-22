import { Injectable } from "@angular/core";
import { Constants } from "../common/constants";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Employee } from "../model/employee.model";
import { ChangePasswordDto } from "../model/change-password.model";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = Constants.EMPLOYEE_URL;

  constructor (private http: HttpClient) {}

  getEmployees() : Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  updateEmployee(id: number, employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee);
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  changePassword(id: number, changePasswordDto: ChangePasswordDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/change-password/${id}`, changePasswordDto);
  }
}
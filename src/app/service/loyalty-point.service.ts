import { Injectable } from "@angular/core";
import { Constants } from "../common/constants";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { parseHostBindings } from "@angular/compiler";

@Injectable({
  providedIn: "root"
})
export class LoyaltyPointService {
  private apiUrl = Constants.POINT_URL;

  constructor(private http: HttpClient) {
    
  }

  getCustomerPointByPhoneNumber(phoneNumber: string) : Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/customer/${phoneNumber}`);
  }

  getCustomerPointFromStorage(): string | null {
    return sessionStorage.getItem("earnedPoint");  
  }

  setCustomerPointToStorage(earnedPoint: string): void {
    sessionStorage.setItem("earnedPoint", earnedPoint);  
  }
   
}
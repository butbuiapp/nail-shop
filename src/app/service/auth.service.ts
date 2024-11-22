import { Injectable } from "@angular/core";
import { Constants } from "../common/constants";
import { LoginRequestDto, LoginResponseDto } from "../model/login.model";
import { Observable, BehaviorSubject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { jwtDecode, JwtPayload } from "jwt-decode";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private apiUrl = Constants.AUTH_URL;

  private loginDataSubject = new BehaviorSubject<any>(null);
  public loginData$ = this.loginDataSubject.asObservable();

  constructor (private http : HttpClient) {
    const accessToken = localStorage.getItem('authToken');
    if (accessToken) {
      // decode token
      const decodedToken: any = this.getDecodedToken(accessToken);
      if (decodedToken) {
        this.loginDataSubject.next(decodedToken);
      }    
    }
  }

  customerLogin(login: LoginRequestDto) : Observable<any> {
    return this.http.post(`${this.apiUrl}/customer/login`, login);
  }

  adminLogin(login: LoginRequestDto) : Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/login`, login);
  }

  storeLoginInfo(loginResponse: LoginResponseDto) {
    // Store in localStorage
    localStorage.setItem('authToken', loginResponse.accessToken);
    // decode token
    const decodedToken: any = this.getDecodedToken(loginResponse.accessToken);
    if (decodedToken) {
      this.loginDataSubject.next(decodedToken);
    }   
  }

  getDecodedToken(token: string): { username: string, role: string } | null {
    try {
      const decodedToken: any = jwtDecode(token);
      return {
        username: decodedToken.sub,
        role: decodedToken.authorities
      };
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }
  
  getLoggedInUser() {
    return this.loginDataSubject.value?.username;
  }

  getLoggedInUsername() {
    return this.loginDataSubject.value?.username;
  }

  getLoggedInRole() {
    return this.loginDataSubject.value?.role;
  }

  logout() {
    localStorage.removeItem('authToken');
    this.loginDataSubject.next(null);
    sessionStorage.removeItem('earnedPoint');
  }
}
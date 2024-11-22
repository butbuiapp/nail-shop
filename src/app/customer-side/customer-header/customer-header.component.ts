import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { LoyaltyPointService } from '../../service/loyalty-point.service';

@Component({
  selector: 'app-customer-header',
  standalone: true,
  imports: [],
  templateUrl: './customer-header.component.html',
  styleUrl: './customer-header.component.css'
})
export class CustomerHeaderComponent implements OnInit {
  private authService = inject(AuthService);
  private loyaltyPointService = inject(LoyaltyPointService);

  private router = inject(Router);

  loginUser: string = '';
  earnedPoint: number = 0;

  ngOnInit(): void {
    this.loginUser = this.authService.getLoggedInUser();

    const storedPoint = this.loyaltyPointService.getCustomerPointFromStorage();
    if (storedPoint) {
      console.log("earnedPoint from sessionStorage=" + storedPoint);
      this.earnedPoint = Number(storedPoint);
    } else {
      this.loyaltyPointService.getCustomerPointByPhoneNumber(this.loginUser).subscribe(
        (response: number) => {
          console.log("earnedPoint response from DB=" + response);
          this.earnedPoint = response;
          this.loyaltyPointService.setCustomerPointToStorage(response.toString()); // Cache it for future calls
      });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['./customer/login']);
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { CustomerService } from '../../service/customer.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit {
  customers: any[] = [];
  errorMessage: string | null = null;
  private customerService = inject(CustomerService);
  private router = inject(Router);

  // for search
  phoneNumber = new FormControl('');

  ngOnInit(): void {
    this.getAllCustomers();
  }

  onViewAppointment(customerId: number, firstName: string, lastName: string) {
    this.router.navigate(
      ['/admin/customers', customerId, 'appointments'],
      {
        state: {firstName, lastName}
      }
    );
  }

  getAllCustomers(): void {
    this.customerService.getCustomers().subscribe(
      (response) => {
        this.customers = response;
      },
      (error) => {
        this.errorMessage = "Failed to load customers.";
      }
    );
  }

  onSearch(): void {
    const phoneNumber = this.phoneNumber.value;
    if (phoneNumber) {
      this.customerService.searchCustomerByPhone(phoneNumber).subscribe(
        (response) => {
          this.customers = [];
          this.customers.push(response);
        },
        (error) => {
          this.errorMessage = error.error;
        }
      );
    } else {
      this.getAllCustomers();
    }
  }

}


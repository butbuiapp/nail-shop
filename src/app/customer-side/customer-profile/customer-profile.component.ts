import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerService } from '../../service/customer.service';
import { AuthService } from '../../service/auth.service';
import { getErrorMessage } from '../../common/constants';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customer-profile.component.html',
  styleUrl: './customer-profile.component.css'
})
export class CustomerProfileComponent implements OnInit {
  errorMessage: string | null = null;
  infoMessage: string | null = null;
  customerForm! : FormGroup;
  phoneNumber : string = "";
  customerId : number = 0;
  private formBuilder = inject(FormBuilder);
  private customerService = inject(CustomerService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.customerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      email: ['', [Validators.email]],
      dob: ['', []],
      password: ['xxxxxxxx'],
    });

    // get user profile
    this.phoneNumber = this.authService.getLoggedInUsername();
    
    this.customerService.searchCustomerByPhone(this.phoneNumber).subscribe(
      (response) => {
        this.customerForm.patchValue(response);
        this.customerId = response.id;
      },
      (error) => {
        if (error.error) {
          this.errorMessage = error.error;
        }
      }
    );
  }

  onSubmit() {
    this.errorMessage = null; 
    if (this.customerForm.valid) {
      const customer = this.customerForm.value;
      // save customer
      this.customerService.updateCustomer(this.customerId, customer).subscribe(
        (response) => {
          this.infoMessage = response.message;
        },
        (error) => {
          if (error.error) {
            this.errorMessage = getErrorMessage(error.error);           
          }         
        }
      );
    }  else {
      this.errorMessage = 'Input is invalid.';
    }
  }

}

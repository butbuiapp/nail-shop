import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerService } from '../../service/customer.service';
import { getErrorMessage } from '../../common/constants';

@Component({
  selector: 'app-customer-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customer-registration.component.html',
  styleUrl: './customer-registration.component.css'
})
export class CustomerRegistrationComponent implements OnInit {
  errorMessage: string | null = null;
  infoMessage: string | null = null;
  customerForm! : FormGroup;
  private formBuilder = inject(FormBuilder);
  private customerService = inject(CustomerService);

  ngOnInit(): void {
    this.customerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      email: ['', [Validators.email]],
      dob: ['', []],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit() {
    this.errorMessage = null; 
    this.infoMessage = null;
    if (this.customerForm.valid) {
      const customer = this.customerForm.value;
      // save customer
      this.customerService.createCustomer(customer).subscribe(
        (response) => {
          this.infoMessage = response.message;
          this.customerForm.reset();
        },
        (error) => {
          if (error.error) {
            this.errorMessage = getErrorMessage(error.error); 
          } else {
            this.errorMessage = 'Failed to create customer. Please try again later.';
          }        
        }
      );
    } else {
      this.errorMessage = 'Input is invalid.';
    }
  }
}

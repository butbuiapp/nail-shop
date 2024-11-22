import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../service/customer.service';
import { ChangePasswordDto } from '../../model/change-password.model';
import { AuthService } from '../../service/auth.service';
import { getErrorMessage } from '../../common/constants';

@Component({
  selector: 'app-customer-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customer-change-password.component.html',
  styleUrl: './customer-change-password.component.css'
})
export class CustomerChangePasswordComponent implements OnInit {
  changePasswordForm!: FormGroup;
  errorMessage: string | null = null;
  infoMessage: string | null = null;
  phoneNumber: string = '';

  private formBuilder = inject(FormBuilder);
  private customerService = inject(CustomerService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      oldPassword: ['', [Validators.required, Validators.minLength(8)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    });
    this.phoneNumber = this.authService.getLoggedInUsername();
  }

  onSubmit() {
    this.errorMessage = null;
    this.infoMessage = null;
    if (this.changePasswordForm.valid) {
      const changePasswordDto: ChangePasswordDto = this.changePasswordForm.value;
      
      this.customerService.changePassword(this.phoneNumber, changePasswordDto).subscribe(
        (response: any) => {
          this.infoMessage = response.message;
          this.changePasswordForm.reset();
        },
        (error) => {
          if (error.error) {
            this.errorMessage = getErrorMessage(error.error);            
          } else {
            this.errorMessage = 'Failed to change password. Please try again.';
          }          
        }
      );
    } else {
      this.errorMessage = 'Input is invalid.';
    }
  }
}

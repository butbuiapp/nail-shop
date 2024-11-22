import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginRequestDto } from '../../model/login.model';
import { AuthService } from '../../service/auth.service';
import { getErrorMessage } from '../../common/constants';

@Component({
  selector: 'app-customer-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customer-login.component.html',
  styleUrl: './customer-login.component.css'
})
export class CustomerLoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string | null = null;

  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.errorMessage = null;
    if (this.loginForm.valid) {
      const loginRequest: LoginRequestDto = this.loginForm.value;
      this.authService.customerLogin(loginRequest).subscribe(
        (response) => {
          this.authService.storeLoginInfo(response);
          this.router.navigate(['./customer/my-appointments']);
        },
        (error) => {
          this.errorMessage = getErrorMessage(error.error); 
        }
      );    
    } else {
      this.errorMessage = 'Input is invalid.';
    }
  }
}

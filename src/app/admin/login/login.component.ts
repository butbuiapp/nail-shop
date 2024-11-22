import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { LoginRequestDto } from '../../model/login.model';
import { getErrorMessage } from '../../common/constants';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
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
      this.authService.adminLogin(loginRequest).subscribe(
        (response) => {
          this.authService.storeLoginInfo(response);
          this.router.navigate(['./admin/appointments']);
        },
        (error) => {
          if (error.error) {
            this.errorMessage = getErrorMessage(error.error);            
          }
        }
      );    
    } else {
      this.errorMessage = 'Input is invalid.';
    }
  }

}

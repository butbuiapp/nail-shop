import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  private authService = inject(AuthService);
  private router = inject(Router);

  loginUser: string | null = null;

  ngOnInit(): void {
    this.loginUser = this.authService.getLoggedInUser();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['./admin/login']);
  }
}

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const role = authService.getLoggedInRole();
  if (!role) {
    if (role === 'ROLE_CUSTOMER') {
      router.navigate(['/customer/login']); // Redirect to login if no token
    } else {
      router.navigate(['/admin/login']); // Redirect to login if no token
    }    
    return false;
  }

  const expectedRole = route.data['role']; // Get the expected role from route data
  if (role === expectedRole) {
    return true; // Grant access
  }

  router.navigate(['/not-found']); // Redirect if unauthorized
  return false;
};

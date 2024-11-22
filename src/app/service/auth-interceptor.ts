import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
// Get the token from localStorage or a service
const token = localStorage.getItem('authToken');

if (token) {
  // Clone the request and add the Authorization header
  req = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}

return next(req);
}

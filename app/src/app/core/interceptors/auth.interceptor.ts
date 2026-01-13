import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Skip interceptor for login and refresh-token endpoints
  if (req.url.includes('/users/login') || req.url.includes('/users/refresh-token')) {
    return next(req);
  }

  // Clone request and add auth header
  const authReq = addAuthHeader(req, authService.accessToken);

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && authService.refreshToken) {
        // Try to refresh the token
        return authService.refreshAccessToken().pipe(
          switchMap(() => {
            // Retry the original request with new token
            const newAuthReq = addAuthHeader(req, authService.accessToken);
            return next(newAuthReq);
          }),
          catchError((refreshError) => {
            // Refresh failed, logout
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );
};

function addAuthHeader(req: HttpRequest<unknown>, token: string | null): HttpRequest<unknown> {
  if (token) {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return req;
}

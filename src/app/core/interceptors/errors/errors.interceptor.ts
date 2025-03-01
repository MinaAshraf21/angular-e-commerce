import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const errorsInterceptor: HttpInterceptorFn = (req, next) => {
  const toastrService = inject(ToastrService);

  return next(req).pipe(
    catchError((err) => {
      // errors logic
      //console.log('from error interceptor', err.error.message);
      if (
        err.error.message != 'You are not logged in. Please login to get access'
      )
        toastrService.error(err.error.message, 'FreshCart');
      return throwError(() => err);
    })
  );
};

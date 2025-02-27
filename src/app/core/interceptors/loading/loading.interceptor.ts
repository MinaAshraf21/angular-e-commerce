import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  // show loading screen in request
  const ngxSpinnerService = inject(NgxSpinnerService);

  ngxSpinnerService.show();

  // hide loading screen in response
  //.pipe(finalize(callback function)) ==> execute some logix after next & error
  return next(req).pipe(
    finalize(() => {
      ngxSpinnerService.hide();
    })
  );
};

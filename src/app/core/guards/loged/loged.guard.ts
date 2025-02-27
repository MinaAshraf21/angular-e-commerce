import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const logedGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const ID = inject(PLATFORM_ID);
  if (isPlatformBrowser(ID)) {
    if (!localStorage.getItem('userToken')) {
      return true;
    }
    router.navigate(['/home']);
    return false;
  } else {
    return false;
  }
};

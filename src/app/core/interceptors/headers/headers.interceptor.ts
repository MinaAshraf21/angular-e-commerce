import { HttpInterceptorFn } from '@angular/common/http';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  // request logic
  // we should'nt modify the original request
  if (localStorage.getItem('userToken')) {
    // we can check on the URL to decide if a the component needs a token then we will execute this code
    // if(req.url.includes('cart')){}
    req = req.clone({
      setHeaders: {
        token: localStorage.getItem('userToken')!,
      },
    }); // copyng the request object
  }
  return next(req); // response logic
};

import { jwtDecode } from './../../../../../node_modules/jwt-decode/build/cjs/index';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}
  userData: any;
  router = inject(Router);

  sendRegisterFormData(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/auth/signup`,
      data
    );
  }
  sendLoginFormData(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/auth/signin`,
      data
    );
  }

  saveUserData() {
    if (localStorage.getItem('userToken')) {
      this.userData = jwtDecode(localStorage.getItem('userToken')!);
      console.log(this.userData);
    }
  }

  logOut(): void {
    localStorage.removeItem('userToken');
    this.userData = null;
    this.router.navigate(['/login']);
  }

  sendUserEmailVerify(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/auth/forgotPasswords`,
      data
    );
  }
  sendResetCode(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/auth/verifyResetCode`,
      data
    );
  }
  resetUserPassword(data: object): Observable<any> {
    return this.httpClient.put(
      `${environment.baseUrl}/api/v1/auth/resetPassword`,
      data
    );
  }
}

import { AuthService } from './../auth/auth.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  inject,
  Injectable,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { environment } from '../../environments/environment';
import { jwtDecode } from './../../../../../node_modules/jwt-decode/build/cjs/index';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private httpClient: HttpClient) {}
  //authService = inject(AuthService);
  userToken: WritableSignal<any> = signal(
    jwtDecode(localStorage.getItem('userToken')!)
  );

  checkoutPayment(cartId: string, data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/orders/checkout-session/${cartId}?url=https://angular-e-commerce-beta.vercel.app/#`,
      {
        shippingAddress: data,
      }
    );
  }

  getUserOrder(): Observable<any> {
    this.userToken.set(jwtDecode(localStorage.getItem('userToken')!));
    return this.httpClient.get(
      `${environment.baseUrl}/api/v1/orders/user/${this.userToken().id}`
    );
  }
}

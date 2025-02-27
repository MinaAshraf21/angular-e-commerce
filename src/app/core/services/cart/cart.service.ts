import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private httpClient: HttpClient) {}
  numOfCartItems: WritableSignal<number> = signal(0);
  //userToken: any = localStorage.getItem('userToken')!;
  addProductToCart(productId: string): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/cart`, {
      productId: productId,
    });
  }

  getLoggedUserCart(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/cart`);
  }

  deleteSpecificCartItem(productId: string): Observable<any> {
    return this.httpClient.delete(
      `${environment.baseUrl}/api/v1/cart/${productId}`
    );
  }

  clearUserCart(): Observable<any> {
    return this.httpClient.delete(`${environment.baseUrl}/api/v1/cart`);
  }

  updateSpecificCartItemCount(
    myCount: number,
    productId: string
  ): Observable<any> {
    return this.httpClient.put(
      `${environment.baseUrl}/api/v1/cart/${productId}`,
      { count: myCount }
    );
  }
}

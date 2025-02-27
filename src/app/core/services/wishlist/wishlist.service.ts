import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  constructor(private httpClient: HttpClient) {}

  getUserWishList(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/wishlist`);
  }

  addItemToWishList(id: string): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/wishlist`, {
      productId: id,
    });
  }
  removeItemFromWishList(id: string): Observable<any> {
    return this.httpClient.delete(
      `${environment.baseUrl}/api/v1/wishlist/${id}`
    );
  }
}

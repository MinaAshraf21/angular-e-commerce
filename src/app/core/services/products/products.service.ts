import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private readonly httpClient: HttpClient) {}

  getAllProducts(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/products`);
  }
  getSpecificProduct(ID: string | null): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/products/${ID}`);
  }
}

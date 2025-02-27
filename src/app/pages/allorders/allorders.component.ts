import { ProductsService } from './../../core/services/products/products.service';
import { CurrencyPipe } from '@angular/common';
import { IOrder } from '../../shared/interfaces/iorder';
import { OrdersService } from './../../core/services/orders/orders.service';
import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-allorders',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.scss',
})
export class AllordersComponent implements OnInit {
  ordersService = inject(OrdersService);
  productsService = inject(ProductsService);
  // orders!: IOrder[];
  orders: WritableSignal<IOrder[]> = signal([]);

  ngOnInit(): void {
    this.getUserOrders();
  }

  getUserOrders(): void {
    this.ordersService.getUserOrder().subscribe({
      next: (res) => {
        this.orders.set(res);
        console.log(this.orders());
      },
    });
  }

  getSpecificProductDetails(id: string): void {
    this.productsService.getSpecificProduct(id).subscribe({
      next: (res) => {
        console.log(res);
      },
    });
  }
}

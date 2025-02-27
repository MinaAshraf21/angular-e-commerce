import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { CartService } from '../../core/services/cart/cart.service';
import { ICart } from '../../shared/interfaces/icart';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);
  // cartDetails!: ICart;
  cartDetails: WritableSignal<ICart> = signal({} as ICart);
  ngOnInit(): void {
    this.getUserCart();
  }

  getUserCart() {
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        console.log(res.data); // totalCartPrice , products[{}]
        this.cartDetails.set(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  removeCartItem(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.deleteSpecificCartItem(id).subscribe({
          next: (res) => {
            console.log(res);
            this.cartDetails.set(res.data);
            this.cartService.numOfCartItems.set(res.numOfCartItems);
          },
          error: (err) => {
            console.log(err);
          },
        });
        Swal.fire({
          title: 'Deleted!',
          text: 'This Product has been deleted.',
          icon: 'success',
        });
      }
    });
  }

  updateCartItemCount(count: number, id: string) {
    this.cartService.updateSpecificCartItemCount(count, id).subscribe({
      next: (res) => {
        console.log(res);
        this.cartDetails.set(res.data);
        this.cartService.numOfCartItems.set(res.numOfCartItems);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  clearCart() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, clear it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.clearUserCart().subscribe({
          next: (res) => {
            console.log(res);
            this.cartDetails.set({} as ICart);
            this.cartService.numOfCartItems.set(0);
          },
          error: (err) => {
            console.log(err);
          },
        });
        Swal.fire({
          title: 'Cleared!',
          text: 'Your Cart has been Cleared.',
          icon: 'success',
        });
      }
    });
  }
}

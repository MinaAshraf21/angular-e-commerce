import { ToastrService } from 'ngx-toastr';
import { WishlistService } from './../../core/services/wishlist/wishlist.service';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { IProduct } from '../../shared/interfaces/iproduct';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../core/services/cart/cart.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wishlist',
  imports: [CurrencyPipe],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss',
})
export class WishlistComponent implements OnInit, OnDestroy {
  private readonly wishlistService = inject(WishlistService);
  private readonly toastrService = inject(ToastrService);
  private readonly cartService = inject(CartService);

  wishList: WritableSignal<IProduct[]> = signal([]);
  getWishListSubscription: Subscription = new Subscription();
  addProductToCartSubscription: Subscription = new Subscription();
  removeItemFromWishListSubscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.getWishList();
  }

  getWishList(): void {
    this.getWishListSubscription = this.wishlistService
      .getUserWishList()
      .subscribe({
        next: (res) => {
          //console.log(res);
          this.wishList.set(res.data);
        },
      });
  }

  removeItemFromWishList(id: string): void {
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
        this.removeItemFromWishListSubscription = this.wishlistService
          .removeItemFromWishList(id)
          .subscribe({
            next: (res) => {
              //console.log(res);
              this.getWishList();
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

  addProductToCart(id: string) {
    this.addProductToCartSubscription = this.cartService
      .addProductToCart(id)
      .subscribe({
        next: (res) => {
          //console.log(res.data);
          this.toastrService.success(res.message, 'FreshCart');
          this.cartService.numOfCartItems.set(res.numOfCartItems);
          this.wishlistService.removeItemFromWishList(id).subscribe({
            next: (res) => {
              this.getWishList();
            },
          });
        },
        error: (err) => {
          //console.log(err);
        },
      });
  }

  ngOnDestroy(): void {
    this.getWishListSubscription.unsubscribe();
    this.addProductToCartSubscription.unsubscribe();
    this.removeItemFromWishListSubscription.unsubscribe();
  }
}

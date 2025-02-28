import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../core/services/cart/cart.service';
import { ProductsService } from '../../core/services/products/products.service';
import { IProduct } from '../../shared/interfaces/iproduct';
import { CurrencyPipe } from '@angular/common';
import { SearchPipe } from '../../shared/pipes/serach/search.pipe';
import { TrimtextPipe } from '../../shared/pipes/trim/trimtext.pipe';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products',
  imports: [CurrencyPipe, TrimtextPipe, SearchPipe, FormsModule, RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit, OnDestroy {
  private readonly productsService = inject(ProductsService);
  private readonly toastrService = inject(ToastrService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);

  searchText: WritableSignal<string> = signal('');
  products: WritableSignal<IProduct[]> = signal([]);
  wishList: WritableSignal<IProduct[]> = signal([]);

  getAllProductsSubscription: Subscription = new Subscription();
  getWishListSubscription: Subscription = new Subscription();
  addProductToCartSubscription: Subscription = new Subscription();
  addItemToWishListSubscription: Subscription = new Subscription();
  removeItemFromWishListSubscription: Subscription = new Subscription();

  ngOnInit() {
    this.getAllProducts();
    this.getWishList();
  }

  isInWishList(wishList: IProduct[], prod: IProduct): boolean {
    return wishList.some((item) => item._id === prod.id);
  }

  getAllProducts() {
    this.getAllProductsSubscription = this.productsService
      .getAllProducts()
      .subscribe({
        next: (res) => {
          this.products.set(res.data);
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  getWishList(): void {
    this.getWishListSubscription = this.wishlistService
      .getUserWishList()
      .subscribe({
        next: (res) => {
          console.log(res);
          this.wishList.set(res.data);
        },
      });
  }

  addProductToCart(id: string, isInWishList: boolean) {
    this.addProductToCartSubscription = this.cartService
      .addProductToCart(id)
      .subscribe({
        next: (res) => {
          console.log(res.data);
          this.toastrService.success(res.message, 'FreshCart');
          this.cartService.numOfCartItems.set(res.numOfCartItems);
          if (isInWishList) {
            this.wishlistService.removeItemFromWishList(id).subscribe({
              next: (res) => {
                console.log(res);
                this.getWishList();
              },
            });
          } else {
            this.getWishList();
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  addItemToWishList(id: string): void {
    this.addItemToWishListSubscription = this.wishlistService
      .addItemToWishList(id)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.toastrService.success(res.message, 'FreshCart');
          this.getWishList();
        },
      });
  }

  removeItemFromWishList(id: string): void {
    this.removeItemFromWishListSubscription = this.wishlistService
      .removeItemFromWishList(id)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.toastrService.success(res.message, 'FreshCart');
          this.getWishList();
        },
      });
  }

  ngOnDestroy(): void {
    this.getAllProductsSubscription.unsubscribe();
    this.getWishListSubscription.unsubscribe();
    this.addProductToCartSubscription.unsubscribe();
    this.addItemToWishListSubscription.unsubscribe();
    this.removeItemFromWishListSubscription.unsubscribe();
  }
}

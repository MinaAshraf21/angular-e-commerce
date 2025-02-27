import {
  Component,
  inject,
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

@Component({
  selector: 'app-products',
  imports: [CurrencyPipe, TrimtextPipe, SearchPipe, FormsModule, RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly toastrService = inject(ToastrService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);

  searchText: WritableSignal<string> = signal('');
  products: WritableSignal<IProduct[]> = signal([]);
  wishList: WritableSignal<IProduct[]> = signal([]);

  ngOnInit() {
    this.getAllProducts();
    this.getWishList();
  }

  isInWishList(wishList: IProduct[], prod: IProduct): boolean {
    return wishList.some((item) => item._id === prod.id);
  }

  getAllProducts() {
    this.productsService.getAllProducts().subscribe({
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
    this.wishlistService.getUserWishList().subscribe({
      next: (res) => {
        console.log(res);
        this.wishList.set(res.data);
      },
    });
  }

  addProductToCart(id: string, isInWishList: boolean) {
    this.cartService.addProductToCart(id).subscribe({
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
    this.wishlistService.addItemToWishList(id).subscribe({
      next: (res) => {
        console.log(res);
        this.toastrService.success(res.message, 'FreshCart');
        this.getWishList();
      },
    });
  }

  removeItemFromWishList(id: string): void {
    this.wishlistService.removeItemFromWishList(id).subscribe({
      next: (res) => {
        console.log(res);
        this.toastrService.success(res.message, 'FreshCart');
        this.getWishList();
      },
    });
  }
}

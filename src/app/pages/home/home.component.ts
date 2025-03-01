import { CategoriesService } from './../../core/services/categories/categories.service';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ProductsService } from '../../core/services/products/products.service';
import { IProduct } from '../../shared/interfaces/iproduct';
import { ICategory } from '../../shared/interfaces/icategory';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { TrimtextPipe } from '../../shared/pipes/trim/trimtext.pipe';
import { SearchPipe } from '../../shared/pipes/serach/search.pipe';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [
    CarouselModule,
    RouterLink,
    CurrencyPipe,
    TrimtextPipe,
    SearchPipe,
    FormsModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  customMainSlider: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    autoplay: true,
    autoplayTimeout: 3000, // every 3 seconds will go next
    autoplayHoverPause: true,
    navSpeed: 700,
    navText: [
      '<i class="fa-solid fa-arrow-left"></i>',
      '<i class="fa-solid fa-arrow-right"></i>',
    ],
    items: 1,
    responsive: {
      0: {
        items: 1,
      },
      // 400: {
      //   items: 2,
      // },
      // 740: {
      //   items: 4,
      // },
      // 940: {
      //   items: 6,
      // },
    },
    nav: true,
  };
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    autoplay: true,
    autoplayTimeout: 3000, // every 3 seconds will go next
    autoplayHoverPause: true,
    navSpeed: 700,
    navText: [
      '<i class="fa-solid fa-arrow-left"></i>',
      '<i class="fa-solid fa-arrow-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 4,
      },
      940: {
        items: 6,
      },
    },
    nav: true,
  };
  private readonly categoriesService = inject(CategoriesService);
  private readonly cartService = inject(CartService);
  private readonly productsService = inject(ProductsService);
  private readonly toastrService = inject(ToastrService);
  private readonly wishlistService = inject(WishlistService);

  categories: WritableSignal<ICategory[]> = signal([]);
  products: WritableSignal<IProduct[]> = signal([]);
  wishList: WritableSignal<IProduct[]> = signal([]);
  //categories: ICategory[] = [];
  // products: IProduct[] = [];
  // wishList!: IProduct[];

  getAllProductsSubscription: Subscription = new Subscription();
  getAllCategoriesSubscription: Subscription = new Subscription();
  getWishListSubscription: Subscription = new Subscription();
  addProductToCartSubscription: Subscription = new Subscription();
  addItemToWishListSubscription: Subscription = new Subscription();
  removeItemFromWishListSubscription: Subscription = new Subscription();

  searchText: WritableSignal<string> = signal('');
  ngOnInit() {
    this.getAllProducts();
    this.getAllCategories();
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
          //console.log(res);
        },
        error: (err) => {
          //console.log(err);
        },
      });
  }

  getAllCategories() {
    this.getAllCategoriesSubscription = this.categoriesService
      .getAllCategories()
      .subscribe({
        next: (res) => {
          this.categories.set(res.data);
          //console.log(res);
        },
        error: (err) => {
          //console.log(err);
        },
      });
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

  addProductToCart(id: string, isInWishList: boolean) {
    this.addProductToCartSubscription = this.cartService
      .addProductToCart(id)
      .subscribe({
        next: (res) => {
          //console.log(res);
          this.toastrService.success(res.message, 'FreshCart');
          this.cartService.numOfCartItems.set(res.numOfCartItems);
          if (isInWishList) {
            this.wishlistService.removeItemFromWishList(id).subscribe({
              next: (res) => {
                //console.log(res);
                this.getWishList();
              },
            });
          } else {
            this.getWishList();
          }
        },
        error: (err) => {
          //console.log(err);
        },
      });
  }

  addItemToWishList(id: string): void {
    this.addItemToWishListSubscription = this.wishlistService
      .addItemToWishList(id)
      .subscribe({
        next: (res) => {
          //console.log(res);
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
          //console.log(res);
          this.toastrService.success(res.message, 'FreshCart');
          this.getWishList();
        },
      });
  }
  ngOnDestroy(): void {
    this.getAllProductsSubscription.unsubscribe();
    this.getAllCategoriesSubscription.unsubscribe();
    this.getWishListSubscription.unsubscribe();
    this.addProductToCartSubscription.unsubscribe();
    this.addItemToWishListSubscription.unsubscribe();
    this.removeItemFromWishListSubscription.unsubscribe();
  }
}

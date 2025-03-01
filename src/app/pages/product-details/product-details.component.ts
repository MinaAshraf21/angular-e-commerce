import { ProductsService } from './../../core/services/products/products.service';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from '../../shared/interfaces/iproduct';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../core/services/cart/cart.service';
import { Subscription } from 'rxjs';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-details',
  imports: [CarouselModule, CurrencyPipe],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  customMainSlider: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    autoplay: false,
    // autoplayTimeout: 3000, // every 3 seconds will go next
    // autoplayHoverPause: true,
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
    },

    nav: true,
  };
  activatedRoute = inject(ActivatedRoute);
  productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);

  product: WritableSignal<IProduct> = signal({} as IProduct);
  addProductToCartSubscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (p) => {
        let productId = p.get('id');
        this.productsService.getSpecificProduct(productId).subscribe({
          next: (prod) => {
            this.product.set(prod.data);
            //console.log(prod.data);
          },
        });
      },
      error: (err) => {
        //console.log(err);
      },
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
        },
        error: (err) => {
          //console.log(err);
        },
      });
  }

  ngOnDestroy(): void {
    this.addProductToCartSubscription.unsubscribe();
  }
}

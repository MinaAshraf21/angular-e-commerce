import { CartService } from './../../core/services/cart/cart.service';
import { AuthService } from './../../core/services/auth/auth.service';
import {
  Component,
  computed,
  inject,
  input,
  OnDestroy,
  OnInit,
  Signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLogin = input<boolean>(true);
  numOfCartItems: Signal<number> = computed(() =>
    this.cartService.numOfCartItems()
  ); // readonly signal
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  getLoggedUserCartSubscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.getLoggedUserCartSubscription = this.cartService
      .getLoggedUserCart()
      .subscribe({
        next: (res) => {
          this.cartService.numOfCartItems.set(res.numOfCartItems);
        },
      });
  }
  logOut() {
    this.authService.logOut();
  }
  ngOnDestroy(): void {
    this.getLoggedUserCartSubscription.unsubscribe();
  }
}

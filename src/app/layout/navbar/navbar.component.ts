import { CartService } from './../../core/services/cart/cart.service';
import { AuthService } from './../../core/services/auth/auth.service';
import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  Signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  isLogin = input<boolean>(true);
  numOfCartItems: Signal<number> = computed(() =>
    this.cartService.numOfCartItems()
  ); // readonly signal
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);

  ngOnInit(): void {
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        this.cartService.numOfCartItems.set(res.numOfCartItems);
      },
    });
  }
  logOut() {
    this.authService.logOut();
  }
}

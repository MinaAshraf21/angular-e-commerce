import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from '../../core/services/orders/orders.service';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  activatedRoute = inject(ActivatedRoute);
  ordersService = inject(OrdersService);
  //router = inject(Router);  ==> navigate paths not links
  // isLoading: boolean = false;
  // errorMsg: string = '';
  // cartId: string = '';
  // checkoutForm!: FormGroup;
  isLoading: WritableSignal<boolean> = signal(false);
  errorMsg: WritableSignal<string> = signal('');
  cartId: WritableSignal<string> = signal('');
  checkoutForm: WritableSignal<FormGroup> = signal({} as FormGroup);

  ngOnInit(): void {
    this.initForm();
    this.getCartId();
  }

  initForm(): void {
    this.checkoutForm.set(
      this.formBuilder.group({
        details: [null, [Validators.required, Validators.minLength(3)]],
        phone: [
          null,
          [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)],
        ],
        city: [null, [Validators.required]],
      })
    );
  }

  getCartId(): void {
    // URLهنا بيتتبع التغييرات اللى هتحصل فى ال
    this.activatedRoute.paramMap.subscribe({
      next: (p) => {
        this.cartId.set(p.get('id')!)!;
      },
    });
    //URLهنا بياخد لقطة من ال
    //اتغير مش هيحس ب اى تغيير URLلو ال
    // this.activatedRoute.snapshot.paramMap.get('id')
  }

  submitForm() {
    if (this.checkoutForm().valid) {
      this.isLoading.set(true);
      this.ordersService
        .checkoutPayment(this.cartId(), this.checkoutForm().value)
        .subscribe({
          next: (res) => {
            console.log(res);
            if (res.status === 'success') {
              open(`${res.session.url}`, '_self');
            }
          },
        });
    } else {
      this.checkoutForm().markAllAsTouched();
    }
  }
}

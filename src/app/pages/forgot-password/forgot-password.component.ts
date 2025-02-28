import { AuthService } from './../../core/services/auth/auth.service';
import {
  Component,
  inject,
  OnDestroy,
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
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  step: number = 1;
  isLoading: WritableSignal<boolean> = signal(false);
  errorMsg: WritableSignal<string> = signal('');

  verifyEmail: WritableSignal<FormGroup> = signal({} as FormGroup);
  verifyCode: WritableSignal<FormGroup> = signal({} as FormGroup);
  resetPassword: WritableSignal<FormGroup> = signal({} as FormGroup);
  verifyUserEmailSubscription: Subscription = new Subscription();
  verifyCodeSubmitSubscription: Subscription = new Subscription();
  resetPasswordSubmitSubscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.verifyEmail.set(
      this.formBuilder.group({
        email: [null, [Validators.required, Validators.email]],
      })
    );
    this.verifyCode.set(
      this.formBuilder.group({
        resetCode: [
          null,
          [Validators.required, Validators.pattern(/^[0-9]{5,}$/)],
        ],
      })
    );
    this.resetPassword.set(
      this.formBuilder.group({
        email: [null, [Validators.required, Validators.email]],
        newPassword: [
          null,
          [Validators.required, Validators.pattern(/^[a-zA-Z]\w{5,14}$/)],
        ],
      })
    );
  }

  verifyUserEmail() {
    if (this.verifyEmail().valid) {
      this.isLoading.set(true);
      // assign email in form1 to the email in form3
      this.resetPassword()
        .get('email')
        ?.patchValue(this.verifyEmail().get('email')?.value);
      this.verifyUserEmailSubscription = this.authService
        .sendUserEmailVerify(this.verifyEmail().value)
        .subscribe({
          next: (res) => {
            console.log(res);

            if (res.statusMsg == 'success') {
              this.step += 1;
            }
            this.isLoading.set(false);
            this.errorMsg.set('');
          },
          error: (err) => {
            console.log(err);
            this.errorMsg.set(err.error.message);
            this.isLoading.set(false);
          },
        });
    }
  }

  verifyCodeSubmit() {
    if (this.verifyCode().valid) {
      this.isLoading.set(true);
      this.verifyCodeSubmitSubscription = this.authService
        .sendResetCode(this.verifyCode().value)
        .subscribe({
          next: (res) => {
            console.log(res);
            if (res.statusMsg !== 'fail') {
              this.step += 1;
            }
            this.isLoading.set(false);
            this.errorMsg.set('');
          },
          error: (err) => {
            console.log(err);
            this.errorMsg.set(err.message);
            this.isLoading.set(false);
          },
        });
    }
  }

  resetPasswordSubmit() {
    if (this.resetPassword().valid) {
      this.isLoading.set(true);
      this.resetPasswordSubmitSubscription = this.authService
        .resetUserPassword(this.resetPassword().value)
        .subscribe({
          next: (res) => {
            if (res.token) {
              localStorage.setItem('userToken', res.token);
              this.authService.saveUserData();
              this.router.navigate(['/home']);
            }
            this.isLoading.set(false);
            this.errorMsg.set('');
          },
          error: (err) => {
            console.log(err);
            this.errorMsg.set(err.message);
            this.isLoading.set(false);
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.resetPasswordSubmitSubscription.unsubscribe();
    this.verifyCodeSubmitSubscription.unsubscribe();
    this.verifyUserEmailSubscription.unsubscribe();
  }
}

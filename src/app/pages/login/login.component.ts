import { AuthService } from './../../core/services/auth/auth.service';
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
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  formBuilder = inject(FormBuilder);
  isLoading: WritableSignal<boolean> = signal(false);
  errorMsg: WritableSignal<string> = signal('');
  success: WritableSignal<string> = signal('');
  loginForm: WritableSignal<FormGroup> = signal({} as FormGroup);

  ngOnInit(): void {
    this.loginForm.set(
      this.formBuilder.group({
        email: [null, [Validators.required, Validators.email]],
        password: [
          null,
          [Validators.required, Validators.pattern(/^[a-zA-Z]\w{5,14}$/)],
        ],
      })
    );
  }

  submitForm() {
    if (this.loginForm().valid) {
      this.isLoading.set(true);
      this.authService.sendLoginFormData(this.loginForm().value).subscribe({
        next: (res) => {
          //console.log(res);
          if (res.message === 'success') {
            setTimeout(() => {
              localStorage.setItem('userToken', res.token);
              this.authService.saveUserData();
              this.router.navigate(['/home']);
            }, 500);
          }
          this.isLoading.set(false);
          this.success.set(res.message);
          this.errorMsg.set('');
        },
        error: (err) => {
          //console.log(err);
          this.errorMsg = err.error.message;
          this.isLoading.set(false);
        },
      });
    } else {
      this.loginForm().markAllAsTouched();
    }
  }
}

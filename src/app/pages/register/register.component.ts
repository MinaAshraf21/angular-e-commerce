import { AuthService } from './../../core/services/auth/auth.service';
import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  authService = inject(AuthService);
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  isLoading: WritableSignal<boolean> = signal(false);
  errorMsg: WritableSignal<string> = signal('');
  success: WritableSignal<string> = signal('');

  // better syntax for formGroup
  registerForm: WritableSignal<FormGroup> = signal({} as FormGroup);

  // registerForm: FormGroup = new FormGroup(
  //   {
  //     name: new FormControl(null, [
  //       Validators.required,
  //       Validators.minLength(3),
  //       Validators.maxLength(20),
  //     ]),
  //     email: new FormControl(null, [Validators.required, Validators.email]),
  //     password: new FormControl(null, [
  //       Validators.required,
  //       Validators.pattern(/^[a-zA-Z]\w{5,14}$/),
  //     ]),
  //     rePassword: new FormControl(null, Validators.required),
  //     phone: new FormControl(null, [
  //       Validators.required,
  //       Validators.pattern(/^01[0125][0-9]{8}$/),
  //     ]),
  //   },
  //   { validators: this.confirmPassword }
  // );

  ngOnInit(): void {
    this.registerForm.set(
      this.formBuilder.group(
        {
          name: [
            null,
            [
              Validators.required,
              Validators.minLength(3),
              Validators.maxLength(20),
            ],
          ],
          email: [null, [Validators.required, Validators.email]],
          password: [
            null,
            [Validators.required, Validators.pattern(/^[a-zA-Z]\w{5,14}$/)],
          ],
          rePassword: [
            null,
            [Validators.required, Validators.pattern(/^[a-zA-Z]\w{5,14}$/)],
          ],
          phone: [
            null,
            [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)],
          ],
        },
        { validators: this.confirmPassword }
      )
    );
  }

  submitForm() {
    if (this.registerForm().valid) {
      this.isLoading.set(true);
      this.authService
        .sendRegisterFormData(this.registerForm().value)
        .subscribe({
          next: (res) => {
            console.log(res);
            if (res.message === 'success') {
              setTimeout(() => {
                this.router.navigate(['/login']);
              }, 500);
            }
            this.isLoading.set(false);
            this.success.set(res.message);
            this.errorMsg.set('');
          },
          error: (err) => {
            console.log(err);
            this.errorMsg.set(err.error.message);

            this.isLoading.set(false);
          },
        });
    } else {
      this.registerForm().markAllAsTouched();
    }
  }

  confirmPassword(formGroup: AbstractControl) {
    const password = formGroup.get('password')?.value;
    const repassword = formGroup.get('rePassword')?.value;

    return password === repassword ? null : { mismatch: true };
  }
}

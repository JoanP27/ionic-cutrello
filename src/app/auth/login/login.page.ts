import { Component, DestroyRef, inject, signal } from '@angular/core';
import { IonGrid, IonRow, IonCol, IonList, IonItem, IonInput, IonButton, NavController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { UserLogin } from '../interfaces/auth';
import { form, required, FormField, FormRoot, email } from '@angular/forms/signals';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonGrid, IonItem, IonRow, IonCol, IonList, IonInput, IonButton, FormField, FormRoot]
})
export class LoginPage {
  #nav = inject(NavController);
  #authService = inject(AuthService);
  #destroyRef = inject(DestroyRef)

  loginModel = signal<UserLogin>({
    email: "",
    password: ""
  });

  loginForm = form(this.loginModel, (schema) => {
    required(schema.email, {message: 'El email no puede estar vacio'});
    required(schema.password, {message: 'La contraseña no puede estar vacia'})
    email(schema.email, {message: 'El email debe ser valido'})
  }, {submission: {
    action: async () => this.login()
  }});

  login()
  {  
    const result = this.#authService.login({...this.loginForm().value()});

    result.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      next: () => {
        this.#nav.navigateForward(['/tasks'])
      },
      error: (err) => console.error(err)
    })
  }
}

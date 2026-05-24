import { Component, DestroyRef, inject, signal } from '@angular/core';
import { IonGrid, IonRow, IonCol, IonList, IonItem, IonInput, IonButton, NavController, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { GoogleLogin, UserLogin } from '../interfaces/auth';
import { form, required, FormField, FormRoot, email } from '@angular/forms/signals';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { addIcons } from 'ionicons';
import { logoGoogle } from 'ionicons/icons';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonGrid, IonItem, IonRow, IonCol, IonList, IonInput, IonButton, FormField, FormRoot, RouterLink, IonIcon, IonLabel]
})
export class LoginPage {
  #nav = inject(NavController);
  #authService = inject(AuthService);
  #destroyRef = inject(DestroyRef)

  constructor() {
    addIcons({
      logoGoogle
    })
  }

  loginModel = signal<UserLogin>({
    email: "",
    password: ""
  });

  public loginGoogle = signal<GoogleLogin>({
    email: '',
    imageUrl: '',
    name: ''
  })

  loginForm = form(this.loginModel, (schema) => {
    required(schema.email, {message: 'El email no puede estar vacio'});
    required(schema.password, {message: 'La contraseña no puede estar vacia'})
    email(schema.email, {message: 'El email debe ser valido'})
  }, {submission: {
    action: async () => this.login()
  }});

  async loginWithFaceBook() {
    const resp = await SocialLogin.login({
      provider: 'facebook',
      options: {
        permissions: ['email']
      }
    })
    if (resp.result.accessToken) {
      this.#authService.LoginWithFacebook(resp.result.accessToken.token).subscribe({
        next: () => {
          this.#nav.navigateRoot('/tasks')
        }
      })
    }
  }

  async loginWithGoogle() {
    try {
      const resp = await SocialLogin.login({
        provider: 'google',
        options: {}
      });
      if(resp.result.responseType === 'online' && resp.result.idToken) {
        this.loginGoogle.set(resp.result.profile);

        this.#authService.logingWithGoogle(resp.result.idToken).subscribe({
          next: () => {
            this.#nav.navigateRoot('/tasks')
          }
        })

        console.log(resp.result.idToken); // Envía esto a tu servidor
      }
    } catch (err) {
      console.error(err);
    }
  }

  login()
  {  
    const result = this.#authService.login({...this.loginForm().value()});

    result.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      next: () => {
        this.#nav.navigateForward(['/tasks'])
      },
      error: (err) => console.error(err.message)
    })
  }
}

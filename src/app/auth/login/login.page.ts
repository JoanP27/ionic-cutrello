import { Component, DestroyRef, inject, signal } from '@angular/core';
import { IonGrid, IonRow, IonCol, IonList, IonItem, IonInput, IonButton, NavController, IonIcon, IonLabel, Platform } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { GoogleLogin, UserLogin } from '../interfaces/auth';
import { form, required, FormField, FormRoot, email } from '@angular/forms/signals';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { addIcons } from 'ionicons';
import { logoFacebook, logoGoogle } from 'ionicons/icons';
import { PushNotifications, Token } from '@capacitor/push-notifications';


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
  #platform = inject(Platform)

  constructor() {
    // Iconos
    addIcons({
      logoGoogle,
      logoFacebook
    })

    if (this.#platform.is('capacitor')) {
      console.log('entra aqui')
      PushNotifications.register();

      // On success, we should be able to receive notifications
      PushNotifications.addListener('registration', (token: Token) => {
        console.log(token)
        this.loginModel().firebaseToken = token.value;
      });

      PushNotifications.addListener('registrationError', (err) => {
        console.error(err.error)
      });
    
    }
  }

  // Formularios de login y login de google
  loginModel = signal<UserLogin>({
    email: "",
    password: "",
    firebaseToken: ''
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

  // Inicia sesion usando facebook
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

  // Inicia sesion usando google
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

  // Inicia sesion usando la api, el usuario y contraseña
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

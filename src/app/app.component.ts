
import { Component, effect, inject, linkedSignal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink, IonHeader, IonToolbar, IonAvatar, IonImg, IonFabButton, IonButton, IonButtons, NavController, Platform } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, heartOutline, heartSharp, archiveOutline, archiveSharp, trashOutline, trashSharp, warningOutline, warningSharp, bookmarkOutline, bookmarkSharp, logOut, logOutOutline, home, homeOutline, homeSharp, person, personSharp, personOutline, logInOutline, logInSharp } from 'ionicons/icons';
import { AuthService } from './auth/services/auth-service';
import { ProfileService } from './profile/services/profile-service';
import { SocialLogin } from '@capgo/capacitor-social-login';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonApp, IonRouterOutlet, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonMenuToggle, IonItem, IonIcon, IonLabel, RouterLink, IonHeader, IonToolbar, IonAvatar, IonImg, IonFabButton, IonButton, IonButtons],
})
export class AppComponent {
 
  #profileService = inject(ProfileService)
  #authService = inject(AuthService)
  #userResource = this.#profileService.getMyUserProfile()
  #navController = inject(NavController)
  #platform = inject(Platform);

  

  public user = linkedSignal(() =>
     this.#userResource.hasValue() ? this.#userResource.value().user : undefined)

  public appName = "Cutrello"

  public appPages = linkedSignal(() => [
    { title: 'Lista de tareas', url: '/tasks/home', icon: 'home' },
    { title: 'Mi perfil', url: `/profile/`+this.user()?.id, icon: 'person' },
  ])

  public logOut() {
    this.#authService.logout()
    .then(() => {
      this.user.update(() => undefined)
      this.#navController.navigateRoot('/auth/login')
    })
    .catch((er) => console.error(er))
  }

  constructor() {
    addIcons({
      logOutOutline,
      homeOutline,
      homeSharp,
      personSharp,
      personOutline,
      logInOutline,
      logInSharp
    });

    this.initializeApp()
  }
  async initializeApp() {
      await this.#platform.ready();
      //...
      await SocialLogin.initialize({
        google: {
          webClientId: '389388754773-5jflblnhhm4qfmk8mf0egdu5die7epda.apps.googleusercontent.com', // the web client id for Android and Web
        },
      });
    }

}

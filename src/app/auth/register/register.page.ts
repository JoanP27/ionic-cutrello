import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonInput, IonButton, IonRouterLink, IonIcon, IonImg } from '@ionic/angular/standalone';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, linkedSignal, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { RegisterData } from '../interfaces/auth';
import { form, required, validate, FormRoot, FormField, minLength, email } from '@angular/forms/signals';
import { samePassword } from '../../shared/validators/samePassword';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64-directive';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { addIcons } from 'ionicons';
import { images } from 'ionicons/icons';

@Component({
  selector: 'app-register-page',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList, FormRoot, IonItem, IonInput, FormField, IonButton, RouterLink, IonRouterLink, IonIcon, IonImg]
})
export class RegisterPage  {

  #router = inject(Router);
  #authService = inject(AuthService);
  #destroyRef = inject(DestroyRef);

  protected registerModel = signal({
    name: '',
    avatar: '',
    password: '',
    repassword: '',
    email: ''
  });

  protected registerForm = form(this.registerModel, schema => {
    required(schema.name, {message: 'El nombre es obligatorio'});
    required(schema.email, {message: 'El email es obligatorio'});
    email(schema.email, {message: 'formato incorrecto, escribe un correo valido'})
    required(schema.avatar, {message: 'El email es obligatorio'});
    required(schema.password, {message: 'La contraseña es obligatoria'})
    minLength(schema.password, 4, {message: 'La contraseña tiene que tener minimo 4 caracteres'})
    required(schema.repassword, {message: 'La contraseña es obligatoria'})
    validate(schema.repassword, ({value, valueOf}) => {
      const p = valueOf(schema.password);

      if(value() !== p) {
        return {kind: 'passwordMismatch', message: 'Las contraseñas deben ser iguales'}
      }

      return null;
    })
  },{submission: {action: async () => this.register()}}) 

  public auxAvatar = linkedSignal(() => this.registerModel().avatar)

  protected register() {
    const registerData : WritableSignal<RegisterData>= linkedSignal(() => {
      return {
        name: this.registerModel().name,
        avatar: this.registerModel().avatar,
        password: this.registerModel().password,
        repassword: this.registerModel().repassword,
        email: this.registerModel().email,
        
      }
    })

    const result = this.#authService.register(registerData())

     result.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
        next:() => this.#router.navigate(['/auth/login'])
     })
  }
  public async pickFromGallery() {
    const photo = await Camera.getPhoto({
      source: CameraSource.Photos,
      height: 640,
      width: 640,
      // allowEditing: true,
      resultType: CameraResultType.DataUrl, // Base64 (url encoded)
    });
    this.auxAvatar.set(photo.dataUrl as string);
    this.registerModel().avatar = (photo.dataUrl as string);
  }
  constructor() {
    addIcons({
      images
    })
  }
}

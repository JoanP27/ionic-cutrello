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
import { camera, images } from 'ionicons/icons';
import { Geolocation } from '@capacitor/geolocation';


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
    //required(schema.avatar, {message: 'El avatar es obligatorio'});
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
  },{submission: {action: async () => {
    console.log('¿Es válido?', this.registerForm().valid());
    console.log('Errores:', this.registerForm().errors());
    this.register()
  }}}) 

  public auxAvatar = linkedSignal(() => this.registerModel().avatar)

  protected async register() {
    console.log("entra")
    try {
      const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 5000,
    })

    const registerData: RegisterData = {
        name: this.registerModel().name,
        avatar: this.registerModel().avatar,
        password: this.registerModel().password,
        email: this.registerModel().email,
        lat: position.coords.latitude ?? 0,
        lng: position.coords.longitude ?? 0
      };
    
    const result = this.#authService.register(registerData)

     result.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
        next:() => this.#router.navigate(['/auth/login'])
     })
    }catch(e) {
      console.error(e)
    }
    
  }

  async takePhoto() {
    const photo = await Camera.getPhoto({
      source: CameraSource.Camera,
      quality: 90,
      width: 400,
      //allowEditing: true, // El usuario puede editar la foto antes de devolverla
      resultType: CameraResultType.DataUrl, // Base64 (url encoded)
    });

    this.auxAvatar.set(photo.dataUrl as string);
    this.registerModel().avatar = (photo.dataUrl as string);
  }

  public async pickFromGallery() {
    const photo = await Camera.getPhoto({
      source: CameraSource.Photos,
      height: 400,
      width: 400,
      //allowEditing: true,
      resultType: CameraResultType.DataUrl, // Base64 (url encoded)
    });
    this.auxAvatar.set(photo.dataUrl as string);
    this.registerModel().avatar = (photo.dataUrl as string);
  }

  constructor() {
    addIcons({
      images,
      camera
    })
  }
}

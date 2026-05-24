import { Component, DestroyRef, inject, input, linkedSignal, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonList, IonItem, IonAvatar, IonImg, IonButton, IonModal, IonInput } from '@ionic/angular/standalone';
import { ProfileService } from '../services/profile-service';
import { User } from '../interfaces/user';
import { form, required, validate, FormRoot, FormField } from '@angular/forms/signals';
import { samePassword } from 'src/app/shared/validators/samePassword';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.page.html',
  styleUrls: ['./profile-page.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton, IonList, IonItem, IonAvatar, IonImg, IonButton, IonModal, FormRoot, IonInput, FormField]
})
export class ProfilePagePage {

  constructor() { }

  id = input.required({ transform: (v: string) => Number(v ?? 0) });

  #profileService = inject(ProfileService);

  #destroyRef = inject(DestroyRef);

  public isProfileFormVisible = signal(false)
  public changeProfileFormVisibility(visible: boolean) {
    this.isProfileFormVisible.update(() => visible)
  }
  
  public isPasswordFormVisible = signal(false)
  public changePasswordFormVisibility(visible: boolean) {
    this.isPasswordFormVisible.update(() => visible)
  }

  protected profileResource = this.#profileService.getSingleUserResource(this.id);
  protected myProfileResource = this.#profileService.getMyUserProfile();


  protected user = linkedSignal<User>(() => {

    const defaultUser = {
      name: '',
      avatar: '',
      id: 0,
      lat: 0,
      lng: 0,
      me: false,
      email: '',
      password: ''
    }

    if(this.id() > 0) {
      return this.profileResource.value()?.user ?? defaultUser
    }
    
    return this.myProfileResource.value()?.user ?? defaultUser;
  })

  public auxAvatar = linkedSignal(() => this.user().avatar)


  protected profileForm = form(this.user, (schema) => {
    required(schema.name, {message: 'El nombre debe ser obligatorio'});
    required(schema.email, {message: 'El email debe ser obligatorio'});
  }, {
    submission: { action: async () => this.onProfileSaveClick() }
  })

  protected changePasswordModel = signal({
    password: '',
    repassword: ''
  })

  protected changePasswordForm = form(this.changePasswordModel, (schema) => {
    required(schema.password, {message: 'La contraseña es obligatoria'});
    required(schema.repassword, {message: 'La contraseña es obligatoria'});
    validate(schema.repassword, ({value, valueOf}) => {
      const p = valueOf(schema.password);

      if(value() !== p) {
        return {kind: 'passwordMismatch', message: 'Las contraseñas deben ser iguales'}
      }

      return null;
    })
  }, {submission: {action: async () => this.onPasswordSaveClick()}})

  protected editProfileVisible = signal(false);
  protected editPasswordVisible = signal(false);

  protected onProfileClick() {
    this.editProfileVisible.set(true);
  }

  protected onPasswordClick() {
    this.editPasswordVisible.set(true);
  }

  protected onPasswordSaveClick() {
    const result = this.#profileService.updateProfilePassword(this.changePasswordModel().password);

    result.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      next: () => {
        this.changePasswordFormVisibility(false)
      },
      error: (er) => console.error(er)
    })
  }
  
  protected async onProfileSaveClick() {
    const saveUser = this.user()

    const result = this.#profileService.updateProfile(saveUser);

    result.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      next: () => {
        this.changeProfileFormVisibility(false)
      },
        error: (er) => console.error(er)
      })
    /*
    const avatarImg = await fetch(this.user().avatar)
    const avatarBlob = await avatarImg.blob()

    const reader = new FileReader()
    reader.onerror = (er) => console.error(er)
    reader.readAsDataURL(avatarBlob)

    reader.addEventListener('loadend', () => {
      saveUser.avatar = reader.result as string
      const result = this.#profileService.updateProfile(saveUser);

      result.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      next: () => {
        this.changeProfileFormVisibility(false)
      },
        error: (er) => console.error(er)
      })
    })
    */
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
    this.user().avatar = (photo.dataUrl as string);
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
    this.user().avatar = (photo.dataUrl as string);
  }
}

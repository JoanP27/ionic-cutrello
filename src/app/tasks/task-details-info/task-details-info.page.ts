import { Component, DestroyRef, inject, linkedSignal, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonListHeader, IonItem, IonInput, IonTextarea, IonDatetimeButton, IonModal, IonDatetime, IonSelect, IonSelectOption, IonButton, IonIcon, IonImg, AlertController, IonButtons, IonItemDivider, NavController, IonRouterLink, IonFabButton, IonFab } from '@ionic/angular/standalone';
import { TaskDetailsPage } from '../task-details/task-details.page';
import { form, FormField, required, schema, FormRoot } from "@angular/forms/signals";
import { Task } from '../interfaces/task';
import { minDate } from 'src/app/shared/validators/minDay';
import { TaskService } from '../services/task-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { addIcons } from 'ionicons';
import { images, link, map } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Router } from '@angular/router';
import { SearchResult } from 'src/app/ol-maps/search-result';
import { OlMap } from "src/app/ol-maps/ol-map";
import { GaAutocomplete } from "src/app/ol-maps/ga-autocomplete";
import { OlMarker } from "src/app/ol-maps/ol-marker";
import { LaunchNavigator } from '@capgo/capacitor-launch-navigator';

@Component({
  selector: 'app-task-details-info',
  templateUrl: './task-details-info.page.html',
  styleUrls: ['./task-details-info.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonList,
    IonListHeader,
    IonItem,
    IonInput,
    FormField,
    IonTextarea,
    IonDatetimeButton,
    IonModal,
    IonDatetime,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonIcon,
    IonImg,
    IonButtons,
    IonItemDivider,
    FormRoot,
    OlMap,
    GaAutocomplete,
    OlMarker,
    RouterLink,
    IonFabButton,
    IonFab
]
})
export class TaskDetailsInfoPage {


  constructor() {
    addIcons({
      images,
      map
    })
  }

  isEditModalOpen = signal<boolean>(false);

  task = inject(TaskDetailsPage).task
  #taskService = inject(TaskService)
  #destroyRef = inject(DestroyRef);
  #nav = inject(NavController);
  #alertController = inject(AlertController)

  auxStatus = linkedSignal(() => this.task().status);
  auxFilePath = linkedSignal(() => this.task().filepath);

  statusForm = form(this.auxStatus);

  taskForm = form(this.task, schema => {

  }, {
    submission: { action: async () => this.onDetailsSave() }
  })
  
  public async onDetailsSave() {
    const result = this.#taskService.updateTask(this.taskForm().value() as Task)
    result.subscribe({
      next: (t) => {
        this.task.update(() => t)
        this.setEditModal(false)
      },
      error: (er) => console.error(er)
    })
  }
  

  public async onDelete() {

    let acceptPressed = false;
    const alert = await this.#alertController.create({
      header: 'Eliminar tarea',
      message: '¿Estas seguro que quieres eliminar esta tarea?',
      buttons: [
        {
          text: 'Aceptar',
          role: 'confirm',
          handler: () => acceptPressed = true
        },
        {
          text: 'Cancelar',
          role: 'cancel',
        }
      ]
    });

    await alert.present()

    await alert.onDidDismiss()

    if(acceptPressed) {
      const result = this.#taskService.deleteTask(this.task().id)
      result.subscribe({
        next: () => {
          this.#nav.back()
        },
        error: (er) => console.error(er)
      })
    }

   
  }

  public async removeImage() {
    const result = this.#taskService.updateImage(this.task().id, '')
    result.subscribe({
      next: (t) => {
        this.task.update(() => t)
      },
      error: (er) => console.error(er)
    })
  }

  public onStatusChange(event: Event) {
    const result = this.#taskService.updateStatus(this.task()!.id, this.auxStatus())
    result.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      next: (t) => this.task.update(ts => t)
    })
  }

  

  public setEditModal(open: boolean){
    this.isEditModalOpen.update(() => open)
  }

  public showMap() {
    LaunchNavigator.navigate({ destination: [ this.coordinates()[1], this.coordinates()[0] ]});
  }


  coordinates = linkedSignal<[number, number]>(() => [this.task().lat, this.task().lng]);

  public async changePlace(result: SearchResult) {
    this.coordinates.set(result.coordinates);

    const taskResult = this.#taskService.updateLocation(this.task().id, result);

    taskResult.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      next: (newtask) => this.task.set(newtask)
    })
  }

  public async removePlace() {
    const taskResult = this.#taskService.updateLocation(this.task().id, {address: null, coordinates: [0,0]});

    taskResult.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      next:  (newtask) => this.task.set(newtask)
    })
  }
   
  public async pickFromGallery() {
    const photo = await Camera.getPhoto({
      source: CameraSource.Photos,
      width: 1024,
      // allowEditing: true,
      resultType: CameraResultType.DataUrl, // Base64 (url encoded)
    });

    this.auxFilePath.set(photo.dataUrl as string);
    const result = this.#taskService.updateImage(this.task()!.id, this.auxFilePath())
    result.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      next: (t) => this.task.update(ts => t)
    })
  }
}

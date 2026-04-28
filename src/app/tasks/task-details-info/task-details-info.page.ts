import { Component, DestroyRef, inject, linkedSignal, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent,
   IonHeader,
   IonTitle,
   IonToolbar,
   IonList,
   IonListHeader,
   IonItem,
   IonInput,
   IonTextarea,
   IonDatetimeButton,
   IonModal,
   IonDatetime,
   IonSelect,
   IonSelectOption,
   IonButton,
   IonIcon,
   IonImg
  } from '@ionic/angular/standalone';
import { TaskDetailsPage } from '../task-details/task-details.page';
import { form, FormField, required } from "@angular/forms/signals";
import { Task } from '../interfaces/task';
import { minDate } from 'src/app/shared/validators/minDay';
import { TaskService } from '../services/task-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { addIcons } from 'ionicons';
import { images, link } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

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
    IonImg
]
})
export class TaskDetailsInfoPage {

  constructor() {
    addIcons({
      images
    })
  }


  task = inject(TaskDetailsPage).task
  #taskService = inject(TaskService)
  #destroyRef = inject(DestroyRef);

  auxStatus = linkedSignal(() => this.task().status);
  auxFilePath = linkedSignal(() => this.task().filepath);

  statusForm = form(this.auxStatus);

  
  public onStatusChange(event: Event) {
    const result = this.#taskService.updateStatus(this.task()!.id, this.auxStatus())
    result.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      next: (t) => this.task.update(ts => t)
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

    this.auxFilePath.set(photo.dataUrl as string);
  }
}

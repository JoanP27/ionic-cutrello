import { Component, DestroyRef, inject, OnInit, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar, IonList,
  IonListHeader,
  IonItem,
  IonInput,
  IonTextarea,
  IonDatetimeButton,
  IonModal,
  IonDatetime,
  IonSelect,
  IonSelectOption
} from '@ionic/angular/standalone';
import { TaskDetailsPage } from '../task-details/task-details.page';
import { form, FormField, required } from "@angular/forms/signals";
import { Task } from '../interfaces/task';
import { minDate } from 'src/app/shared/validators/minDay';
import { TaskService } from '../services/task-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    IonSelectOption
  ]
})
export class TaskDetailsInfoPage {

  #task = inject(TaskDetailsPage).task
  #taskService = inject(TaskService)
  #destroyRef = inject(DestroyRef);


  public taskForm = form(this.#task as WritableSignal<Task>, (schema) => {
    required(schema.title, {message: 'La tarea debe tener un titulo'}),
    required(schema.description, {message: 'La tarea debe tener una descripcion'})
    minDate(schema.deadLine,new Date().toISOString().split('T')[0], { message: 'la fecha no puede ser anterior a hoy' })
  });
  
  public onStatusChange(event: Event) {
    const result = this.#taskService.updateStatus(this.#task()!.id, this.#task()!.status)
    result.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      next: (t) => this.#task.update(ts => t)
    })
  }
}

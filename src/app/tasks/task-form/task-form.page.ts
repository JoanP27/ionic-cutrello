import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonInput,
  IonButton,
  IonTextarea,
  IonIcon,
  IonDatetimeButton,
  IonModal,
  IonDatetime,
  NavController,
  IonLabel
 } from '@ionic/angular/standalone';
import { TaskInsert } from '../interfaces/task-insert';
import { form, schema, FormRoot, FormField, required } from '@angular/forms/signals';
import { addIcons } from 'ionicons';
import { images } from 'ionicons/icons';
import { TaskService } from '../services/task-service';
import { minDate } from 'src/app/shared/validators/minDay';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.page.html',
  styleUrls: ['./task-form.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonItem,
    IonInput,
    IonButton,
    FormRoot,
    FormField,
    IonTextarea,
    IonIcon,
    IonDatetimeButton,
    IonModal,
    IonDatetime,
    IonLabel
]
})
export class TaskFormPage {
  constructor() { 
    addIcons({ images });
  }

  #taskService = inject(TaskService);
  #nav = inject(NavController);

  public taskModel = signal<TaskInsert>({
    title: '',
    description: '',
    filepath: '',
    deadLine: new Date().toISOString().split('T')[0]
  });

  public taskForm = form(this.taskModel, (schema) => {
    required(schema.title, {message: 'El titulo no puede estar vacio'});
    required(schema.description, {message: 'La descripcion no puede estar vacia'});
    minDate(schema.deadLine,new Date().toISOString().split('T')[0], { message: 'la fecha no puede ser anterior a hoy' })
  }, {submission: {
    action: async () => this.onSubmit()
  }});

  public onSubmit() {
    const result = this.#taskService.addTask({...this.taskForm().value()});

    result.subscribe({
      next: () => {
        this.#nav.navigateForward(['/tasks'])
      },
      error: (err) => console.error(err)
    });
  }
}

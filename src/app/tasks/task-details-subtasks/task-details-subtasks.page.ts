import { Component, DestroyRef, inject, linkedSignal, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCol, IonItem, IonTextarea, IonButton, IonCheckbox } from '@ionic/angular/standalone';
import { TaskService } from '../services/task-service';
import { TaskDetailsPage } from '../task-details/task-details.page';
import { SubTask } from '../interfaces/task';
import { form, required, FormField, FormRoot } from '@angular/forms/signals';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TaskSubtaskItemComponent } from "../task-subtask-item/task-subtask-item.component";

@Component({
  selector: 'app-task-details-subtasks',
  templateUrl: './task-details-subtasks.page.html',
  styleUrls: ['./task-details-subtasks.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonCol, IonItem, IonTextarea, FormField, FormRoot, IonButton, IonCheckbox, TaskSubtaskItemComponent]
})
export class TaskDetailsSubtasksPage  {

  #taskService = inject(TaskService);
  #destroyRef = inject(DestroyRef);

  task = inject(TaskDetailsPage).task

  subtareas = linkedSignal<SubTask[]>(() => this.task().subtasks ?? [])

  addSubTaskModel = signal<SubTask>({
    id: 0,
    description: '',
    completed: false,
  });

  addSubTaskForm = form(this.addSubTaskModel, schema => {
    required(schema.description, { message: 'el campo es obligatorio' })
  }, {submission: {action: async() => this.addSubTask()}});

  deleteSubTask(subTask: SubTask) {
    this.subtareas.update(s => s.filter(subt => subt.id != subTask.id))
  }

  addSubTask() {
    console.log("tarea")
    const result = this.#taskService.addSubTask(this.task().id,this.addSubTaskModel())

    result.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
        next:(subtarea) => {
          this.subtareas.update((s) => s.concat(subtarea))
        },
        error:(e) => console.error(e)
      });  
  }

  constructor() { }
}

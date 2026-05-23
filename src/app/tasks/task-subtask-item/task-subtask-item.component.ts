import { Component, DestroyRef, inject, linkedSignal, model, output } from '@angular/core';
import { IonItem, IonCheckbox, IonButton, IonIcon } from "@ionic/angular/standalone";
import { SubTask } from '../interfaces/task';
import { TaskService } from '../services/task-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { addIcons } from 'ionicons';
import { trashBinOutline, trashBinSharp, trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-task-subtask-item',
  templateUrl: './task-subtask-item.component.html',
  styleUrls: ['./task-subtask-item.component.scss'],
  imports: [IonItem, IonCheckbox, IonButton, IonIcon],
})
export class TaskSubtaskItemComponent {
  #taskService = inject(TaskService);
  #destroyRef = inject(DestroyRef);

  public subTask = model.required<SubTask>()
  subTaskDeleted = output<SubTask>();

  public changeStatus() {
    const subTareaCambiada = {...this.subTask()}
    subTareaCambiada.completed = !subTareaCambiada.completed

    const result = this.#taskService.updateSubTask(subTareaCambiada)

    result.subscribe({
      next: (t) => {
        this.subTask.set(t)
      },
      error: (er) => {
        console.error(er)
      }
    })
  }

  public delete() {
    const result = this.#taskService.removeSubTask(this.subTask());
    result.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      next: () => {
        this.subTaskDeleted.emit(this.subTask())},
      error: (er) => console.error(er)
    });
  }

  constructor() { 
    addIcons({
      trashBinSharp,
      trashOutline
    })
  }
}

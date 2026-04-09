import { Component, computed, DestroyRef, inject, linkedSignal, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSegment,
  IonLabel,
  IonSegmentButton,
  IonGrid,
  IonRow,
  IonCol,
  IonSegmentContent,
  IonSegmentView,
  IonFab,
  IonFabButton,
  IonIcon
} from '@ionic/angular/standalone';
import { TaskCardComponent } from "../task-card/task-card.component";
import { TaskService } from '../services/task-service';
import { Task } from '../interfaces/task';
import { addIcons } from 'ionicons';
import { add, heart } from 'ionicons/icons';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonSegment,
    IonLabel,
    IonSegmentButton,
    TaskCardComponent,
    IonSegmentContent,
    IonSegmentView,
    IonFab,
    IonFabButton,
    IonIcon,
    RouterLink
  ]
})
export class TasksPage {
  constructor(){
    addIcons({ add });
  }

  #destroyRef = inject(DestroyRef);
  protected idCounter = 0;
  taskService = inject(TaskService);
  taskResource = this.taskService.getTasksResource();
  protected tareas = linkedSignal(() => this.taskResource.value()?.tasks ??[])

  protected pendientes: Signal<Task[]> = computed(() => this.tareas().filter((t: Task) => t.status == 0));
  protected enProceso: Signal<Task[]> = computed(() => this.tareas().filter((t: Task) => t.status == 1));
  protected terminadas: Signal<Task[]> = computed(() => this.tareas().filter((t: Task) => t.status == 2));

  public onStatusChanged(task: Task) {
    const result = this.taskService.updateStatus(task.id, task.status);
    result.subscribe({
      next: () => 
        this.tareas.update(() => this.tareas().map(t => t.id == task.id ? task : t)),
      
      error: (er) => 
        console.error(er)
    });
  }

  public onDelete(task: Task) {
    const result = this.taskService.deleteTask(task.id);
    result.subscribe({
      next: () =>
        this.tareas.update(() => this.tareas().filter(t => t.id != task.id)),

      error: (er) => 
        console.error(er)
    })
  }

  
}

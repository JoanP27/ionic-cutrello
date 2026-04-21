import { Component, inject, input, linkedSignal, numberAttribute, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons,IonTabs, IonTab, IonTabBar, IonTabButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chatboxEllipsesOutline, information, informationCircle, informationCircleOutline, map } from 'ionicons/icons';
import { TaskService } from '../services/task-service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.page.html',
  styleUrls: ['./task-details.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonBackButton, IonButtons, IonTabs, IonTabBar, IonTabButton, IonIcon]
})
export class TaskDetailsPage {

  protected id = input.required({ transform: numberAttribute });

  #taskService = inject(TaskService)
  #taskResource = this.#taskService.getSingleTaskResource(this.id);

  task = linkedSignal(() => this.#taskResource.hasValue() ? this.#taskResource.value()?.task : {
    id: 0,
    title: '',
    description: '',
    status: 0,
    filepath: '',
    createdAt: '',
    deadLine: '',
    lat: 0,
    lng: 0,
    address: '',
    participants: [],
    subtasks: [],
    mine: false
  })

  constructor() {
    addIcons({
      informationCircleOutline,
      map,
      chatboxEllipsesOutline
    })
  }
}

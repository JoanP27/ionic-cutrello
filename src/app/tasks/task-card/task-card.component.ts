import { Component, input, linkedSignal, OnInit, output, Signal } from '@angular/core';
import { IonCard, IonCardContent, IonCardTitle, IonSelect, IonSelectOption, IonCardHeader, IonButton, IonIcon, IonGrid, IonRow, IonCol } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { closeCircleOutline } from 'ionicons/icons';
import { Task } from '../interfaces/task';
import { form, FormField } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
  imports: [
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonSelect,
    IonSelectOption,
    IonCardHeader,
    IonButton,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    FormField,
    RouterLink
],
})
export class TaskCardComponent {
  constructor() {
    addIcons({ closeCircleOutline });
  }

  public task = input.required<Task>();
  public statusChanged = output<Task>();
  public taskDeleted = output<Task>();

  public auxTask = linkedSignal(() => this.task().status)

  public statusForm = form(this.auxTask);


  public onChange(event: Event) {
    //console.log(console.log(event.detail.value))
    console.log(this.statusForm().value())

    const task = {...this.task()}
    task.status = this.statusForm().value()

    this.statusChanged.emit(task);
  }

  public onDelete(event: Event) {
    this.taskDeleted.emit(this.task())
  }
}

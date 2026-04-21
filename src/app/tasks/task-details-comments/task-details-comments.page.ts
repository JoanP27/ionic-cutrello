import { Component, inject, input, numberAttribute, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, Platform } from '@ionic/angular/standalone';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TaskService } from '../services/task-service';

@Component({
  selector: 'app-task-details-comments',
  templateUrl: './task-details-comments.page.html',
  styleUrls: ['./task-details-comments.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class TaskDetailsCommentsPage {

  #platform = inject(Platform)
  #service = inject(TaskService)

  id = input.required({transform: numberAttribute});
  page = signal<number>(1)

  #commentsResoure = this.#service.getCommentsResource(this.id, this.page)

  constructor() {
      this.#platform.resume.pipe(takeUntilDestroyed()).subscribe(
        () => this.#commentsResoure.reload()
      )
   }

  public ionViewWillEnter() {
    this.#commentsResoure.reload()
  }

}

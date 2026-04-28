import { Component, inject, input, linkedSignal, numberAttribute, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, Platform, IonList, IonListHeader, IonItem, IonCard, IonCardHeader, IonAvatar, IonImg, IonLabel, IonCol, IonRow, IonFab, IonFabButton, IonIcon, AlertController, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TaskService } from '../services/task-service';
import { Comment, CommentResponse } from '../interfaces/task';
import { addIcons } from 'ionicons';
import { add, text } from 'ionicons/icons';
import { InfiniteScrollCustomEvent, IonInfiniteScrollCustomEvent } from '@ionic/core';

@Component({
  selector: 'app-task-details-comments',
  templateUrl: './task-details-comments.page.html',
  styleUrls: ['./task-details-comments.page.scss'],
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
    IonCard,
    IonCardHeader,
    IonAvatar,
    IonImg,
    IonLabel,
    IonCol,
    IonRow,
    IonFab,
    IonFabButton,
    IonIcon,
    IonInfiniteScroll,
    IonInfiniteScrollContent
]
})
export class TaskDetailsCommentsPage {


  #platform = inject(Platform)
  #service = inject(TaskService)
  #alertController = inject(AlertController)

  id = input.required({transform: numberAttribute});
  page = signal<number>(1)

  

  #commentsResoure = this.#service.getCommentsResource(this.id, this.page)
  comments = linkedSignal<CommentResponse | undefined, Comment[]>({
    source: () => this.#commentsResoure.hasValue() ? this.#commentsResoure?.value() : {
      comments: []
    },
    computation: (resp, prev) => {
      if(!resp) return prev?.value ?? [];
      return this.page() > 1 && prev ? prev.value.concat(resp!.comments) : resp?.comments;
    },
  })

  public async addComment() {
    const alert = await this.#alertController.create({
      header: 'Nuevo comentario',
      inputs: [{
        name: 'comentario',
        type: 'textarea',
        placeholder: 'Escribe tu comentario'
      }],
      buttons: [{
        text: 'Enviar',
        role: 'ok'
      },{
        text: 'Cancelar',
        role: 'cancel'
      }]
    });
    await alert.present();
    const result = await alert.onDidDismiss();

    if(result.role == 'ok') {

      console.log(result)

      const commentario : Comment = {
        id: 0,
        taskId: this.id(),
        comment: '',
        currentPage: 0,
        hasNextPage: false,
        createdAt: '',
        user: {
          id: 0,
          lat: 0,
          lng: 0,
          me: false,
          name: '',
          avatar: '',
          email: ''
        }
      }

      commentario.comment = result.data.values.comentario;

      this.#service.addComment(this.id(), commentario)
      .subscribe({
        next: (c: Comment) => {
          this.comments.update(cs => [c, ...cs])
        },
        error: (er) => console.error(er)
      })
    }
  }

  constructor() {
      this.#platform.resume.pipe(takeUntilDestroyed()).subscribe(
        () => this.#commentsResoure.reload()
      )
      addIcons({
        add
      })
   }

  public ionViewWillEnter() {
    this.#commentsResoure.reload()
  }
  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.page.update((p) => p + 1);
  
    setTimeout(() => {
      event?.target?.complete
    }, 500);
  }

}

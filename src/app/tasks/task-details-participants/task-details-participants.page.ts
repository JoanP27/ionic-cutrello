import { Component, computed, DestroyRef, inject, linkedSignal, model, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonAvatar, IonLabel, IonBadge, IonButton, IonFab, IonFabButton, IonIcon, IonInput } from '@ionic/angular/standalone';
import { TaskService } from '../services/task-service';
import { ProfileService } from 'src/app/profile/services/profile-service';
import { User } from 'src/app/profile/interfaces/user';
import { debounce, form, FormField } from '@angular/forms/signals';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TaskDetailsPage } from '../task-details/task-details.page';

@Component({
  selector: 'app-task-details-participants',
  templateUrl: './task-details-participants.page.html',
  styleUrls: ['./task-details-participants.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList, IonItem, IonAvatar, IonLabel, IonBadge, IonButton, IonFab, IonFabButton, IonIcon, IonInput, FormField]
})
export class TaskDetailsParticipantsPage {
  #service = inject(ProfileService)
  #taskService = inject(TaskService)
  #destroyRef = inject(DestroyRef);

  task = inject(TaskDetailsPage).task

  participantes = linkedSignal(() => this.task().participants)

  search = signal('');
  searchForm = form(this.search, schema => {
    debounce(schema, 600)
  });

  searchCorrecto = linkedSignal(() => this.search() != '' ?  this.search() : undefined )

  userResource = this.#service.getUserResource(this.searchCorrecto);

  searchResults = linkedSignal(() => this.userResource?.value()?.users ?? []);

  

  idCreador = linkedSignal(() => this.task().creator)
  idTarea = model.required<number>();
 
  eliminar(participante: User) {
    if(this.participantes().filter(p => p.id === participante.id).length > 0) {
      console.log(participante)
      const result = this.#taskService.removeParticipant(this.task().id, participante)

      result.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
        next:() => {
          this.participantes.update((p) => p.filter(part => part.id != participante.id))
        },
        error:(e) => console.error(e)
      })
    }
  }

  anyadirParticipante(participante: User) {
    if(this.participantes().filter(p => p.id === participante.id).length <= 0) {
      
      const result = this.#taskService.addParticipant(this.task().id, participante)


        result.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
        next:() => {
          this.participantes.update((p) => [participante,...p])
        },
        error:(e) => console.error(e)
      });  
    }
  }
  constructor() { }

}

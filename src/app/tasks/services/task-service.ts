import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { SingleSubTasksResponse, TaksResponse } from '../interfaces/taks-response';
import { map, Observable } from 'rxjs';
import { TaskInsert } from '../interfaces/task-insert';
import { Comment, CommentResponse, SingleCommentResponse, SubTask, Task } from '../interfaces/task';
import { SignleTaksResponse } from '../interfaces/signle-taks-response';
//import { User } from '../../profile/interfaces/user';
//import { SearchResult } from '../../ol-maps/search-result';

@Injectable({
  providedIn: 'root',
})
export class TaskService {

  #http = inject(HttpClient);
  #tasksUrl = "tasks/";

  getTasksResource(): HttpResourceRef<TaksResponse | undefined>
  {
    return httpResource<TaksResponse>(() => `${this.#tasksUrl}`)
  }
  getSingleTaskResource(id: Signal<number>): HttpResourceRef<SignleTaksResponse | undefined>
  {
    return httpResource<SignleTaksResponse>(() => 
    id() > 0 ? `${this.#tasksUrl}${id()}` : undefined
  );
  }
  getCommentsResource(taskId: Signal<number>, page: Signal<number>): HttpResourceRef<CommentResponse | undefined> {
    return httpResource<CommentResponse>(() => `${this.#tasksUrl}${taskId()}/comments?page=${page()}`)
  }
  
  addTask(task: TaskInsert): Observable<Task>
  {
    return this.#http.post<SignleTaksResponse>(`${this.#tasksUrl}`, task).pipe(map((t) => t.task))
  } 
  updateTask(task: Task): Observable<Task>
  {
    return this.#http.put<SignleTaksResponse>(`${this.#tasksUrl}${task.id}`, task).pipe(map((t) => t.task))
  }
  updateStatus(id: number, status: number): Observable<Task>
  {
    console.log(status)
    return this.#http.put<SignleTaksResponse>(`${this.#tasksUrl}${id}/status`, { status }).pipe(map((t) => t.task))
  }

  /*addParticipant(id: number, user: User): Observable<Task> {
    return this.#http.post<Task>(`${this.#tasksUrl}${id}/participants/${user.id}`, {})
  }*/

  addSubTask(id: number, subtask: SubTask): Observable<SubTask> {
    return this.#http.post<SingleSubTasksResponse>(`${this.#tasksUrl}${id}/subtasks/`, subtask).pipe(map(t => t.subtask))
  }

  updateSubTask(subtask: SubTask): Observable<SubTask> {
    return this.#http.put<SingleSubTasksResponse>(`${this.#tasksUrl}subtasks/${subtask.id}`, subtask).pipe(map(t => t.subtask))
  }

  removeSubTask(subtask: SubTask): Observable<SubTask> {
    return this.#http.delete<void>(`${this.#tasksUrl}subtasks/${subtask.id}`).pipe(map(() => subtask))
  }

  updateImage(id: number, filepath: string): Observable<Task> {
    return this.#http.put<SignleTaksResponse>(`${this.#tasksUrl}${id}`, {filepath: filepath}).pipe(map(t => t.task))
  }

  addComment(idTask: number, comment: Comment): Observable<Comment> {
    return this.#http.post<SingleCommentResponse>(`${this.#tasksUrl}${idTask}/comments`, comment).pipe(map(t => t.comment))
  }

  /*updateLocation(id: number, result: SearchResult): Observable<Task> {
    return this.#http.put<SignleTaksResponse>(`${this.#tasksUrl}${id}`, {
      address: result.address, 
      lat: result.coordinates[0],
      lng: result.coordinates[1]
    }).pipe(map(t => t.task))
  }*/

  /*removeParticipant(id: number, user: User): Observable<Task> {
    return this.#http.delete<Task>(`${this.#tasksUrl}${id}/participants/`, {})
  }*/

  deleteTask(id: number): Observable<void>
  {
    return this.#http.delete<void>(`${this.#tasksUrl}${id}`)
  }
}

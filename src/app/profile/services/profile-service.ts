import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { SingleUserResponse, User, UserResponse } from '../interfaces/user';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  #http = inject(HttpClient);
  #usersUrl = "users/";

  getUserResource(nombre: Signal<string | undefined>): HttpResourceRef<UserResponse | undefined>
  {
    return httpResource<UserResponse>(() => `${this.#usersUrl}name/${nombre()}`)
  }


  getMyUserProfile(): HttpResourceRef<SingleUserResponse | undefined> {
    return httpResource<SingleUserResponse>(() => `${this.#usersUrl}me`);
  }

  getSingleUserResource(id: Signal<number>):  HttpResourceRef<SingleUserResponse | undefined> {
    return httpResource<SingleUserResponse>(() => 
        id() > 0 ? `${this.#usersUrl}${id()}` : undefined
    )
  }

  addUser(user: User): Observable<User>
  {
    return this.#http.post<SingleUserResponse>(`${this.#usersUrl}`, user).pipe(map((u) => u.user))
  }

  updateProfile(user: User): Observable<void> {
    return this.#http.put<void>(`${this.#usersUrl}me`, user)
  }
  
  updateProfilePassword(passwd: string): Observable<void> {
    return this.#http.put<void>(`${this.#usersUrl}me/password`, {password: passwd})
  }

}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal, signal } from '@angular/core';
import { AuthToken, RegisterData, SingleRegisterResponse, UserLogin } from '../interfaces/auth';
import { catchError, from, map, Observable, of, switchMap } from 'rxjs';
import { Preferences } from '@capacitor/preferences'
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #http = inject(HttpClient);
  #authUrl = 'auth/';

  #logged = signal(false) ;

  public register(register: RegisterData): Observable<string> {
    return this.#http.post<SingleRegisterResponse>(`${this.#authUrl}register`, register).pipe(map((email) => email.email))
  }

  public getLogged(): Signal<boolean> {
    return this.#logged.asReadonly();
  }

  public login(data: UserLogin): Observable<void>{
    return this.#http.post<AuthToken>(`${this.#authUrl}login`, data).pipe(switchMap(async(token) => {
        //localStorage.setItem('token', token.accessToken);
        await Preferences.set({ key: 'fs-token', value: token.accessToken })
        console.log(token)
        this.#logged.set(true)
    }));
  }

  public async logout(): Promise<void> {
    //localStorage.removeItem('token');
    await Preferences.remove({key: 'fs-token'})
    this.#logged.set(false)
  }

  public isLogged(): Observable<boolean> {
    const currentToken = localStorage.getItem('token')
    if(!this.#logged() && !currentToken) {
      const result : Observable<boolean> = of(false);
      return result;
    }
    
    if(this.#logged()) {
      const result : Observable<boolean> = of(true);
      return result;
    }

    /*return this.#http.get(`${this.#authUrl}validate`).pipe(map(() => {
      this.#logged.set(true);
      return true;
    }),
    catchError(async (er) => {
      console.log(er)
      await Preferences.remove({key: 'fs-token'})
      return of(false);
    })
  )*/
    return from(Preferences.get({key: 'fs-token'})).pipe(switchMap((token) => {
      if(!token.value) {
        return of(false)
      }
      return this.#http.get(`${this.#authUrl}validate`).pipe(map(() => {
        this.#logged.set(true);
        return true;
      }),
      catchError(() => of(false))
    );
    }))
  }

  public logingWithGoogle(token: string): Observable<void> {
    return this.#http.post<AuthToken>(`${this.#authUrl}google`, {'token': token}).pipe(switchMap(async (token) => {
      console.log('esto es un token: ', token.accessToken)
      await Preferences.set({ key: 'fs-token', value: token.accessToken })
      //localStorage.setItem('token', token.accessToken);
      this.#logged.set(true)
    }));
  }
}

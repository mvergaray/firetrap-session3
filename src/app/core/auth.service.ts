import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';

import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';

import { DatabaseService } from './database.service';

export interface User {
  uid: string;
  email?: string | null;
  photoURL?: string;
  displayName?: string;
  role?: string;
  description?: string;
  linkedin?: string;
  instagram?: string;
  followers?: number;
  following?: number;
  posts?: number;
}

@Injectable()
export class AuthService {

  user: Observable<User | null>;

  constructor (private afAuth: AngularFireAuth,
    private rtdb: DatabaseService,
    private router: Router) {

    this.user = this.afAuth.authState
      .switchMap((user) => {
        if (user) {
          return this.rtdb.getObject(`users/${user.uid}`);
        } else {
          return Observable.of(null);
        }
      });
  }

  ////// OAuth Methods /////

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  githubLogin() {
    const provider = new firebase.auth.GithubAuthProvider();
    return this.oAuthLogin(provider);
  }

  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider();
    return this.oAuthLogin(provider);
  }

  twitterLogin() {
    const provider = new firebase.auth.TwitterAuthProvider();
    return this.oAuthLogin(provider);
  }

  emailLogin(email: string = '', password: string = '') {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        console.debug('Welcome to Firestarter!!!');
        return this.updateUserData(user);
      })
      .catch((error) => this.handleError(error));
  }

  private oAuthLogin(provider: firebase.auth.AuthProvider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        console.debug('Welcome to Firestarter!!!');
        return this.updateUserData(credential.user);
      })
      .catch((error) => this.handleError(error));
  }

  //// Anonymous Auth ////

  anonymousLogin() {
    return this.afAuth.auth.signInAnonymously()
      .then((user) => {
        console.debug('Welcome to Firestarter!!!');
        return this.updateUserData(user); // if using firestore
      })
      .catch((error) => {
        console.error(error.code);
        console.error(error.message);
        this.handleError(error);
      });
  }



  signOut() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/']);
    });
  }

  // If error, console log and notify user
  private handleError(error: Error) {
    console.error(error.message);
  }

  // Sets user data to firestore after succesful login
  private updateUserData(user: User) {

    //const userRef: AngularFireObject<User> = this.rtdb.object(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email || null,
      displayName: user.displayName || 'no tengo nombre :(',
      description: 'UPC. 25 años',
      linkedin: 'https://www.linkedin.com/in/marco-vergaray-7a012893/',
      instagram: 'https://www.instagram.com/macoy25a/',
      role: 'UI Developer',
      photoURL: user.photoURL || 'https://instagram.flim17-1.fna.fbcdn.net/vp/f5fe258dd0682202b0118247d959b132/5B9CB81B/t51.2885-19/s150x150/31128532_387011181781314_8681984064799899648_n.jpg',
    };
    return this.rtdb.setObject(`users/${user.uid}`, data);//userRef.set(data);
  }
}

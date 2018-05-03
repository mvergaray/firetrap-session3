import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';

import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import { IUser } from './IUser';

@Injectable()
export class AuthService {

  user: Observable<IUser | null>;

  constructor (private afAuth: AngularFireAuth,
    private rtdb: AngularFireDatabase,
    private router: Router) {

    this.user = this.afAuth.authState
      .switchMap((user) => {
        if (user) {
          return this.rtdb.object(`users/${user.uid}`).valueChanges();
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
  private updateUserData(user: IUser) {

    const userRef: AngularFireObject<IUser> = this.rtdb.object(`users/${user.uid}`);

    const data: IUser = {
      uid: user.uid,
      email: user.email || null,
      displayName: user.displayName || 'no tengo nombre :(',
      photoURL: user.photoURL || 'https://orig00.deviantart.net/a866/f/2008/233/8/e/v_for_vendetta_by_vendetta666.jpg',
      anticucho: true
    };
    return userRef.set(data);
  }
}

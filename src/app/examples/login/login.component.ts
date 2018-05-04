import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    data: Date = new Date();
    focus;
    focus1;
    showloginForm = false;
    email;
    password;

    constructor (private authService: AuthService, private router: Router) { }

    ngOnInit() {
        var body = document.getElementsByTagName('body')[0];
        body.classList.add('login-page');

        var navbar = document.getElementsByTagName('nav')[0];
        navbar.classList.add('navbar-transparent');
    }
    ngOnDestroy() {
        var body = document.getElementsByTagName('body')[0];
        body.classList.remove('login-page');

        var navbar = document.getElementsByTagName('nav')[0];
        navbar.classList.remove('navbar-transparent');
    }
    signUpWithFacebook() {
        this.signUp('facebook');
    }
    signUpWithGoogle() {
        this.signUp('google');
    }
    signUpWithEmail() {
        this.signUp('email');
    }
    signUp(method: string) {
        let signInPromise: Promise<void>;
        switch (method) {
            case 'facebook':
                signInPromise = this.authService.facebookLogin();
                break;
            case 'google':
                signInPromise = this.authService.googleLogin();
                break;
            case 'twitter':
                signInPromise = this.authService.twitterLogin();
                break;
            case 'email':
                signInPromise = this.authService.emailLogin(this.email, this.password);
                break;
            default:
                break;
        }
        signInPromise.then(_ => this.successfullSignInCallback());
    }

    private successfullSignInCallback() {
        this.router.navigate(['/profile']);
    }
}

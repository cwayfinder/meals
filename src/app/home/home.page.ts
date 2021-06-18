import { Component } from '@angular/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { LoadingController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public loading: any;
  public isGoogleLogin = false;
  public user = null;
  constructor(public loadingController: LoadingController, private fireAuth: AngularFireAuth,) {
    GoogleAuth.init();
  }

  async ngOnInit() {
    this.loading = await this.loadingController.create({
      message: 'Connecting ...',
    });
  }

  async doLogin() {
    const googleUser = await GoogleAuth.signIn();
    console.log('my user: ', googleUser);
    const { idToken, accessToken } = googleUser.authentication;
    this.onLoginSuccess(idToken, accessToken);
    // this.user = googleUser;
    // this.isGoogleLogin = true;
  }

  onLoginSuccess(accessToken, accessSecret) {
    const credential = accessSecret ? firebase.auth.GoogleAuthProvider
      .credential(accessToken, accessSecret) : firebase.auth.GoogleAuthProvider
      .credential(accessToken);
    this.fireAuth.signInWithCredential(credential)
      .then((success) => {
        alert('successfully');
        this.isGoogleLogin = true;
        this.user = success.user;
        console.log(this.user);
        this.loading.dismiss();
      });

  }

  logout() {
    GoogleAuth.signOut().then(() => {
      this.isGoogleLogin = false;
    });
  }

}

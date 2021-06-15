import { Component, OnInit } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { LoadingController, Platform } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  public loading: any;
  public isGoogleLogin = false;
  public user = null;

  constructor(
    private google: GooglePlus,
    public loadingController: LoadingController,
    private fireAuth: AngularFireAuth,
    private platform: Platform,
  ) {}

  async ngOnInit() {
    this.loading = await this.loadingController.create({
      message: 'Connecting ...',
    });
  }

  doLogin() {
    let params: any;
    if (this.platform.is('cordova')) {
      if (this.platform.is('android')) {
        params = {
          webClientId: '1080095589120-kdbgqutpu7bnl76pbh0e5n2ndnjnum6a.apps.googleusercontent.com',
          offline: true,
        };
      } else {
        params = {};
      }
      this.google.login(params)
        .then((response) => {
          const { idToken, accessToken } = response;
          this.onLoginSuccess(idToken, accessToken);
        }).catch((error) => {
        console.log(error);
        alert('error:' + JSON.stringify(error));
      });
    } else {
      console.log('else...');
      this.fireAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(success => {
        console.log('success in google login', success);
        this.isGoogleLogin = true;
        this.user = success.user;
      }).catch(err => {
        console.log(err.message, 'error in google login');
      });
    }
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
        this.loading.dismiss();
      });

  }

  onLoginError(err) {
    console.log(err);
  }

  logout() {
    this.fireAuth.signOut().then(() => {
      this.isGoogleLogin = false;
    });
  }
}

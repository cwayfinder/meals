import { ChangeDetectorRef, Component } from '@angular/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { LoadingController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public loading: any;
  public isGoogleLogin = false;
  public user = null;
  userData: any;
  constructor(
    public loadingController: LoadingController,
    private eventService: EventService,
    private fireAuth: AngularFireAuth,
    private changeRef: ChangeDetectorRef
  ) {
    GoogleAuth.init();
    this.eventService.getObservable().subscribe((data) => {
      this.user = data.user;
      console.log(this.user);
      this.isGoogleLogin = true;
      this.changeRef.detectChanges();
    });    
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
        // alert('successfully');
        this.isGoogleLogin = true;
        this.user = success.user;
        console.log(this.user);
        this.loading.dismiss();
      });

  }

  logout() {
    GoogleAuth.signOut().then(() => {
      this.fireAuth.signOut();
      this.isGoogleLogin = false;
      this.changeRef.detectChanges();
    });

  }

}

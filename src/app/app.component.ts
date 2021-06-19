import { ChangeDetectorRef, Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Platform } from '@ionic/angular';
import { EventService } from './services/event.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private fireAuth: AngularFireAuth, private platform: Platform, private eventService: EventService, private changeRef: ChangeDetectorRef) {
    this.platform.ready().then(() => {
      this.alreadyLogin();
    });


  }
  alreadyLogin() {
    this.fireAuth.onAuthStateChanged(
      user => {
        console.log(user);
        if (user != null) {
          this.eventService.publishUserData(
            {
              user
            }
          );
        }

      });

  }

}

import { Injectable } from '@angular/core';
// import { AngularFireMessaging } from '@angular/fire/messaging'; //TODO:generating error
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { BehaviorSubject } from 'rxjs';
import { AppComponent } from '../app.component';

@Injectable({
  providedIn: 'root',
})
export class MessagingService {
  currentMessage = new BehaviorSubject(null);

  constructor(private angularFireMessaging: AngularFireMessaging) {
    //TODO:generating error
    // this.angularFireMessaging.messages.subscribe((_messaging) => {
    //   _messaging.onMessage = _messaging.onMessage.bind(_messaging);
    //   _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
    // });

    this.angularFireMessaging.messages.subscribe((message) => {
      // Handle incoming message here
      console.log('Received FCM message:', message);
    });

    this.angularFireMessaging.tokenChanges.subscribe((token) => {
      // Handle token change here
      console.log('FCM token changed:', token);
    });
  }
  requestPermission() {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        localStorage.setItem('permission', token);
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe((payload) => {

      this.currentMessage.next(payload);
      this.showCustomeNotification(payload);
    });
  }

  showCustomeNotification(payload: any) {
    let notificationData = payload['notification'];
    let title = notificationData['title'];
    let options = {
      body: notificationData['body'],
      icon: '/assets/images/dres-logo.png',
      budge: '/assets/dres-logo.png',
      image: '/assets/dres-logo.png',
    };

    let notification: Notification = new Notification(title, options);

    notification.onclick = (event) => {
      event.preventDefault();
      window.location.href = 'https://care-homes.azurewebsites.net/';
    };
  }
}

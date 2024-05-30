import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker'
import { BaseComponent } from './shared/components/base/base.component';
import { EnvironmentConfig } from 'ng-message-kit';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseComponent implements OnInit {
  title = 'care-homes';
  public toggleSidebar: boolean = false;
  public env: EnvironmentConfig = {
    loggedInUserId:4,

    loggedInUserName:"Om",

    getAllUser: "/Users/GetChatUsers",

    baseUrl: "http://192.168.29.154:2033/api",

    tokenName: "_accessToken",

    fireBase: {
      apiKey: "AIzaSyCO9c-bHNkZLUQeStyQS3B_FdU9Ae6W2C0",
      authDomain: "quickchat-8b689.firebaseapp.com",
      projectId: "quickchat-8b689",
      storageBucket: "quickchat-8b689.appspot.com",
      messagingSenderId: "982998485573",
      appId: "1:982998485573:web:5905fab3218b835412f12c",
      measurementId: "G-ZLZ8HHMJCX",
      vapidKey: "BCgpb20Vw6RSpVAbAfReHUa09D8IDQ03EoJ1qVRwwjTBJFQp_kQT4fDND24U8_n0awcr2UfpawnGv8vk9i813aM"
    },

    pusher: {
      key: "aabb1e5220a0270ec3ed",
      id: "1788019",
      secretKey: "b578230c76f95d0f4e07"
    }
  }
  public isShowChat: boolean = false;

  constructor(private updates: SwUpdate) {
    super();
    this.updates.versionUpdates.subscribe(event => {
      this.updates.activateUpdate().then(() => document.location.reload());
    });
  }
  ngOnInit(): void {
    if (localStorage.getItem('_identity')) {
      this.isAuthenticated = true;
    }
    else {
      localStorage.clear();
      // window.location.pathname = "/login";
    }



  }

  public sidebarToggle(event) {
    this.toggleSidebar = event;
  }

  public toggleChatBox() {
    this.isShowChat = !this.isShowChat;
  }

}

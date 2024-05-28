import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker'
import { BaseComponent } from './shared/components/base/base.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseComponent implements OnInit {
  title = 'care-homes';
  public toggleSidebar: boolean = false;
  constructor(updates: SwUpdate) {
    super();
    updates.available.subscribe(event => {
      updates.activateUpdate().then(() => document.location.reload());
    })
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

}

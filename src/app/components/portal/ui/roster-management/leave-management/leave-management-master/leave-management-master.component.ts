import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/shared/components/base/base.component';

@Component({
  selector: 'app-leave-management-master',
  templateUrl: './leave-management-master.component.html',
  styleUrls: ['./leave-management-master.component.scss']
})
export class LeaveManagementMasterComponent extends BaseComponent implements OnInit {

  public activeTab: number = 1;

  constructor() { super(); }

  ngOnInit(): void {
  }

  public onTabChange(index: number) {
    this.activeTab = index;
  }
}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Subscription } from 'rxjs';

import { CareHomeService } from 'src/app/services/care-home.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { CareHome } from 'src/app/shared/models/care-home';
import { RecordFilterParameter } from 'src/app/shared/models/RecordFilterParameter';

@Component({
  selector: 'app-care-homes-managment',
  templateUrl: './care-homes-managment.component.html',
  styleUrls: ['./care-homes-managment.component.scss']
})
export class CareHomesManagmentComponent extends BaseComponent implements OnInit {
  @Output() editCareHomeId: EventEmitter<any> = new EventEmitter<any>();

  careHomeList: CareHome[] = [];
  records: RecordFilterParameter;
  public recordCount: number;
  public lastRecord: number;
  public subscription: Subscription;
  public rotate = true;
  public maxSize = 6;

  constructor(private careHomeService: CareHomeService) { super(); }

  ngOnInit(): void {
    this.records = new RecordFilterParameter();
    this.records.skip = 0;
    this.records.top = 10;
    this.records.searchString = "";
    this.records.paginate = true;
    this.getAllCareHomes();
  }

  public pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    this.lastRecord = event.page * event.itemsPerPage;

    this.records.skip = startItem;
    this.records.paginate = true;
    this.getAllCareHomes();

  }

  public getAllCareHomes() {
    this.SetLoading(true);
    this.subscription = this.careHomeService.getAllCareHomes(this.records).subscribe(response => {
      this.careHomeList = response.items;
      this.recordCount = response.totalCount;
      this.lastRecord = response.count;
      this.SetLoading(false);
    }, (error) => {
      this.SetLoading(false);
      alert(error.error);
    })
  }

  public editCareHome(careHomeId: number) {
    if (careHomeId) {
      this.editCareHomeId.emit(careHomeId);
    }
  }

  public removeCareHome(careHomeId: number) {
    if (careHomeId) {
      if (confirm("Are you sure you want to remove this care home?")) {
        this.careHomeService.deleteCareHome(careHomeId).subscribe(response => {
          this.getAllCareHomes();
        }, error => {
          alert(error.error);
          console.log(error);
        })
      }
    }
  }

  public searchPatients() {
    if (this.subscription)
      this.subscription.unsubscribe();
    this.delay(this.getAllCareHomes());
    // this.getAllCareHomes();
  }

  private delay(callback) {
    let timer;
    return function () {
      var context = this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        callback.apply(context, args);
      }, 500);
    };
  }

}

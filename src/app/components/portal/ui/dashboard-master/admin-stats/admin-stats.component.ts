import { Component, OnInit } from '@angular/core';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { CareHomeService } from 'src/app/services/care-home.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { CareHome } from 'src/app/shared/models/care-home';
import { CareHomeLimit } from 'src/app/shared/models/care-home-limit';
import { CareHomeReportsFilter } from 'src/app/shared/models/care-home-reports-filter';
import { CareHomeUserLog } from 'src/app/shared/models/care-home-user-log';
import { RecordFilterParameter } from 'src/app/shared/models/RecordFilterParameter';

@Component({
  selector: 'app-admin-stats',
  templateUrl: './admin-stats.component.html',
  styleUrls: ['./admin-stats.component.scss'],
})
export class AdminStatsComponent extends BaseComponent implements OnInit {
  public tab: number = 1;
  public careHomeLimits: Array<CareHomeLimit> = [];
  public userLogs: Array<CareHomeUserLog> = [];
  public careHomesUsersCount: Array<CareHomeUserLog> = [];
  public careHomesList: Array<CareHome> = [];

  public records: CareHomeReportsFilter;
  public recordCount: number;
  public lastRecord: number;

  public userLogsRecords: CareHomeReportsFilter;
  public userLogsRecordCount: number;
  public userLogsLastRecord: number;

  public careHomeUserRecords: CareHomeReportsFilter;
  public careHomeUserRecordCount: number;
  public careHomeUserLastRecord: number;

  public rotate = true;
  public maxSize = 6;

  constructor(
    private dashboardServiecs: DashboardService,
    private careHomeServices: CareHomeService
  ) {
    super();
  }

  ngOnInit(): void {
    var reco: RecordFilterParameter = new RecordFilterParameter();
    reco.paginate = false;
    this.getCareHome(reco);
    this.showTab(1);
  }

  //tab= { 1:careHomeLimits}
  public showTab(tab: number) {
    let careHomeId = Number(
      JSON.parse(localStorage.getItem('_identity')).careHomeId
    );
    this.tab = tab;
    if (tab == 1) {
      this.records = new CareHomeReportsFilter();
      this.records.skip = 0;
      this.records.top = 10;
      this.records.paginate = true;
      this.getCareHomePatientsLimit(this.records);
    } else if (tab == 2) {
      this.userLogsRecords = new CareHomeReportsFilter();
      this.userLogsRecords.skip = 0;
      this.userLogsRecords.top = 10;
      this.userLogsRecords.paginate = true;
      this.getCareHomeUserLogs(this.userLogsRecords);
    } else {
      this.careHomeUserRecords = new CareHomeReportsFilter();
      this.careHomeUserRecords.skip = 0;
      this.careHomeUserRecords.top = 10;
      this.careHomeUserRecords.paginate = true;
      this.getUserCountCareHome(this.careHomeUserRecords);
    }
  }

  public getCareHomePatientsLimit(records: CareHomeReportsFilter) {
    this.SetLoading(true);

    this.dashboardServiecs.getCareHomeLimits(records).subscribe(
      (response) => {
        if (response) {
          this.careHomeLimits = response.items;
          this.recordCount = response.totalCount;
          this.lastRecord = response.count;
        } else {
          this.careHomeLimits = [];
        }
        this.SetLoading(false);
      },
      (error) => {
        this.SetLoading(false);
        alert(error.error);
      }
    );
  }

  public pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    this.lastRecord = event.page * event.itemsPerPage;

    this.records.skip = startItem;
    this.records.paginate = true;
    this.getCareHomePatientsLimit(this.records);
  }

  public filterByCareHome(careHomeId: number) {
    if (this.tab == 1) {
      if (careHomeId && careHomeId != 0) {
        this.records.careHomeId = careHomeId;
      } else {
        this.records.careHomeId = null;
      }
      this.getCareHomePatientsLimit(this.records);
    } else if (this.tab == 2) {
      if (careHomeId && careHomeId != 0) {
        this.userLogsRecords.careHomeId = careHomeId;
      } else {
        this.userLogsRecords.careHomeId = null;
      }
      this.getCareHomeUserLogs(this.userLogsRecords);
    } else {
      if (careHomeId && careHomeId != 0) {
        this.careHomeUserRecords.careHomeId = careHomeId;
      } else {
        this.careHomeUserRecords.careHomeId = null;
      }
      this.getUserCountCareHome(this.careHomeUserRecords);
    }
  }

  public userLogPageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    this.userLogsLastRecord = event.page * event.itemsPerPage;

    this.userLogsRecords.skip = startItem;
    this.userLogsRecords.paginate = true;
    this.getCareHomeUserLogs(this.userLogsRecords);
  }

  // location wise careHome user count
  public getCareHomeUserLogs(records: CareHomeReportsFilter) {
    this.SetLoading(true);

    this.dashboardServiecs.getCareHomeUsers(records).subscribe(
      (response) => {
        if (response) {
          this.userLogs = response.items;
          this.userLogsRecordCount = response.totalCount;
          this.userLogsLastRecord = response.count;
        } else {
          this.careHomeLimits = [];
        }
        this.SetLoading(false);
      },
      (error) => {
        this.SetLoading(false);
        alert(error.error);
      }
    );
  }

  public getCareHome(record) {
    this.careHomeServices.getAllCareHomes(record).subscribe(
      (response) => {
        if (response) {
          this.careHomesList = response.items.filter((x) => x.isActive == true);
        } else {
          this.careHomesList = [];
        }
        this.SetLoading(false);
      },
      (error) => {
        this.SetLoading(false);
        alert(error.error);
      }
    );
  }

  // location wise careHome user count
  public getUserCountCareHome(records: CareHomeReportsFilter) {
    this.SetLoading(true);
    this.dashboardServiecs.getUserCountCareHome(records).subscribe(
      (response) => {
        if (response) {
          this.careHomesUsersCount = response.items;
          this.careHomeUserRecordCount = response.totalCount;
          this.careHomeUserLastRecord = response.count;
        } else {
          this.careHomesUsersCount = [];
        }
        this.SetLoading(false);
      },
      (error) => {
        this.SetLoading(false);
        alert(error.error);
      }
    );
  }

  public userRecordPageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    this.careHomeUserLastRecord = event.page * event.itemsPerPage;

    this.careHomeUserRecords.skip = startItem;
    this.careHomeUserRecords.paginate = true;
    this.getUserCountCareHome(this.careHomeUserRecords);
  }
}

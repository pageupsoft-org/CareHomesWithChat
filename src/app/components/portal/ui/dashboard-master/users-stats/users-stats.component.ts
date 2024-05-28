import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { Chart } from 'chart.js';


@Component({
  selector: 'app-users-stats',
  templateUrl: './users-stats.component.html',
  styleUrls: ['./users-stats.component.scss']
})
export class UsersStatsComponent extends BaseComponent implements OnInit {

  public tab: number = 3;
  public updatedLogs = [];

  constructor(private dashboardService: DashboardService) { super(); }

  ngOnInit(): void {
    this.showTab(1);
  }

  public showTab(tab: number) {
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.tab = tab;
    if (tab == 1) {
      this.getLogs();
    }
    else if (tab == 2) {
      this.userloggedInReport();
    }
    else { }
  }

  private getLogs() {
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    let userId = null;
    if (this.currentUserRole == this.userType.SuperUser) {
      userId = this.currentUserId;
    }
    this.SetLoading(true);
    this.dashboardService.updateLogByUsers(careHomeId, userId).subscribe(
      (response) => {
        if (response.length > 0)
          this.updatedLogs = response;

        this.SetLoading(false);
      },
      (err) => {
        this.SetLoading(false);
        console.error(err.error);
      });
  }

  private userloggedInReport() {

    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.dashboardService.userLoginLog(careHomeId).subscribe((response) => {
      this.showBarChart0(response);
    },
      (err) => {
        console.error(err.error);
      }
    );
  }

  private showBarChart0(graphData) {
    document.getElementById('chart-10').remove(); // this is my <canvas> element
    document.getElementById('graph-container-10').innerHTML =
      '<canvas id="chart-10"></canvas>';
    let labes =
      graphData.length > 0 ? Object.keys(graphData[0].dayCounts) : ['-'];
    let dataSet = [];
    graphData.forEach((element) => {
      let data = {

        label: element.userName,
        backgroundColor:
          '#' + Math.floor(Math.random() * 16777215).toString(16),
        data: Object.values(element.dayCounts),
      };
      dataSet.push(data);
    });

    const data = {
      labels: labes,
      datasets: dataSet,
    };

    new Chart('chart-10', {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        scales: {
          xAxes: { stacked: true, },
          yAxes: {
            beginAtZero: true,
            stacked: true,
          },
        },
      },
    });
  }
}


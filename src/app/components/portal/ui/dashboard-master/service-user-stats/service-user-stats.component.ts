import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { DashboardService } from 'src/app/services/dashboard.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { PatientReportFilterParameter } from 'src/app/shared/models/service-user-report-filter-parameter';
import { PatientAdmission } from 'src/app/shared/models/patient-admission';
import { PatientCarePlan } from 'src/app/shared/models/patient-care-plan';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-service-user-stats',
  templateUrl: './service-user-stats.component.html',
  styleUrls: ['./service-user-stats.component.scss'],
})
export class ServiceUserStatsComponent extends BaseComponent implements OnInit {
  careHomeList = [];
  public records: PatientReportFilterParameter;
  public recordCount: number;
  public lastRecord: number;

  public riskAssessmentRecords: PatientReportFilterParameter;
  public riskAssessmentRecordCount: number;
  public riskAssessmentLastRecord: number;
  public fromDate: Date = new Date();
  public toDate: Date = new Date();

  public rotate = true;
  public maxSize = 6;
  // public patientId: number;
  public tab: number = 3;
  public startDate: Date = new Date();
  public endDate: Date = new Date();
  public patients: Array<PatientAdmission> = [];
  public carePlans: Array<PatientCarePlan> = [];
  public riskAssessments: Array<PatientCarePlan> = [];

  constructor(
    private dashboardService: DashboardService,
    private patientService: PatientService
  ) {
    super();
  }

  public longestActivePatients: Array<any> = [];
  ngOnInit(): void {
    this.showTab(1);
  }

  ngOnChanges(): void { }

  //tab= { 3:recoveryStar, 2 : careplan ,1:graph}
  public showTab(tab: number) {
    let careHomeId = Number(
      JSON.parse(localStorage.getItem('_identity')).careHomeId
    );
    this.tab = tab;
    if (tab == 1) {
      this.serviceUserStatistics();
      this.locationStatistics();
      this.upcomingRiskAssessments();
      this.upcomingCarePlan();
      this.getActivePatiencsCounts();
      this.upcomingMedication();
      this.getLongestActiveCases();
      this.patientStatusAverage();
    } else if (tab == 2) {
      this.getPatients();
      this.records = new PatientReportFilterParameter();
      this.records.skip = 0;
      this.records.top = 10;
      this.records.paginate = true;
      this.records.careHomeId = careHomeId;
      if (this.currentUserRole != this.userType.Admin) {
        this.records.userId = this.currentUserId;
      }
      this.getCarePlan(this.records);
    } else {
      this.getPatients();
      this.riskAssessmentRecords = new PatientReportFilterParameter();
      this.riskAssessmentRecords.skip = 0;
      this.riskAssessmentRecords.top = 10;
      this.riskAssessmentRecords.paginate = true;
      this.riskAssessmentRecords.careHomeId = careHomeId;
      if (this.currentUserRole != this.userType.Admin) {
        this.riskAssessmentRecords.userId = this.currentUserId;
      }
      this.getRiskAssessments(this.riskAssessmentRecords);
    }
  }

  public pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    this.lastRecord = event.page * event.itemsPerPage;

    this.records.skip = startItem;
    this.records.paginate = true;
    this.getCarePlan(this.records);
  }

  public filterByPatienId(patientId: number) {
    if (patientId) {
      this.records.patientId = patientId;
    } else {
      this.records.patientId = null;
    }

    this.getCarePlan(this.records);
  }

  public filterByDates() {
    let startDate = new Date(this.startDate);
    let endDate = new Date(this.endDate);
    if (endDate < startDate) {
      alert('Please select proper dates');
    } else {
      this.records.startDate = startDate;
      this.records.endDate = endDate;
    }

    this.getCarePlan(this.records);
  }

  public riskAssessmentPageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    this.riskAssessmentLastRecord = event.page * event.itemsPerPage;

    this.riskAssessmentRecords.skip = startItem;
    this.riskAssessmentRecords.paginate = true;
    this.getRiskAssessments(this.riskAssessmentRecords);
  }

  public riskAssessmentByPatienId(patientId: number) {
    if (patientId) {
      this.riskAssessmentRecords.patientId = patientId;
    } else {
      this.riskAssessmentRecords.patientId = null;
    }

    this.getRiskAssessments(this.riskAssessmentRecords);
  }

  public riskAssessmentByDates() {
    let fromDate = new Date(this.fromDate);
    let toDate = new Date(this.toDate);
    if (toDate < fromDate) {
      alert('Please select proper dates');
    } else {
      this.riskAssessmentRecords.startDate = fromDate;
      this.riskAssessmentRecords.endDate = toDate;
    }

    this.getRiskAssessments(this.riskAssessmentRecords);
  }

  prepareData(data: Array<number>) {
    let ret = [];
    data.forEach((element) => {
      ret.push(element);
      ret.push(0);
    });

    return ret;
  }

  public getLongestActiveCases() {
    let careHomeId = Number(
      JSON.parse(localStorage.getItem('_identity')).careHomeId
    );
    let userId = null;
    if (this.currentUserRole != this.userType.Admin) {
      userId = this.currentUserId;
    }
    this.dashboardService.getLongestActiveCases(careHomeId, userId).subscribe(
      (response) => {
        this.longestActivePatients = response;
      },
      (err) => {
        console.error(err.error);
      }
    );
  }

  public getCarePlan(record: PatientReportFilterParameter) {
    if (record) {
      this.SetLoading(true);
      this.dashboardService.completedCarePlan(record).subscribe(
        (response) => {
          if (response) {
            this.carePlans = response.items;
            this.recordCount = response.totalCount;
            this.lastRecord = response.count;
          }
          this.SetLoading(false);
        },
        (error) => {
          this.SetLoading(false);
          alert(error.error);
        }
      );
    }
  }

  public getRiskAssessments(record: PatientReportFilterParameter) {
    if (record) {
      this.SetLoading(true);
      this.dashboardService.completedRiskAssessments(record).subscribe(
        (response) => {
          if (response) {
            this.riskAssessments = response.items;
            this.riskAssessmentRecordCount = response.totalCount;
            this.riskAssessmentLastRecord = response.count;
          }
          this.SetLoading(false);
        },
        (error) => {
          this.SetLoading(false);
          alert(error.error);
        }
      );
    }
  }

  private serviceUserStatistics() {
    let careHomeId = Number(
      JSON.parse(localStorage.getItem('_identity')).careHomeId
    );
    let userId = null;
    if (this.currentUserRole != this.userType.Admin) {
      userId = this.currentUserId;
    }
    this.dashboardService.serviceUserStatistics(careHomeId, userId).subscribe(
      (response) => {
        this.showBarChart0(response);
      },
      (err) => {
        console.error(err.error);
      }
    );
  }

  private locationStatistics() {
    let careHomeId = Number(
      JSON.parse(localStorage.getItem('_identity')).careHomeId
    );
    let userId = null;
    if (this.currentUserRole != this.userType.Admin) {
      userId = this.currentUserId;
    }
    this.dashboardService.locationStatistics(careHomeId, userId).subscribe(
      (response) => {
        this.showBarChart2(response);
      },
      (err) => {
        console.error(err.error);
      }
    );
  }

  private upcomingRiskAssessments() {
    let careHomeId = Number(
      JSON.parse(localStorage.getItem('_identity')).careHomeId
    );
    let userId = null;
    if (this.currentUserRole != this.userType.Admin) {
      userId = this.currentUserId;
    }
    this.dashboardService
      .getUpcomingRiskAssessments(careHomeId, userId)
      .subscribe(
        (response) => {
          this.showBarChart3(response);
        },
        (err) => {
          console.error(err.error);
        }
      );
  }

  private getActivePatiencsCounts() {
    let careHomeId = Number(
      JSON.parse(localStorage.getItem('_identity')).careHomeId
    );
    let userId = null;
    if (this.currentUserRole != this.userType.Admin) {
      userId = this.currentUserId;
    }
    this.dashboardService.activePatientLog(careHomeId, userId).subscribe(
      (response) => {
        this.showLineChart4(response);
      },
      (err) => {
        console.error(err.error);
      }
    );
  }

  private upcomingCarePlan() {
    let careHomeId = Number(
      JSON.parse(localStorage.getItem('_identity')).careHomeId
    );
    let userId = null;
    if (this.currentUserRole != this.userType.Admin) {
      userId = this.currentUserId;
    }
    this.dashboardService.upcomingCarePlan(careHomeId, userId).subscribe(
      (response) => {
        this.showBarChart5(response);
      },
      (err) => {
        console.error(err.error);
      }
    );
  }

  private upcomingMedication() {
    let careHomeId = Number(
      JSON.parse(localStorage.getItem('_identity')).careHomeId
    );
    let userId = null;
    if (this.currentUserRole != this.userType.Admin) {
      userId = this.currentUserId;
    }
    this.dashboardService.upcomingMedication(careHomeId, userId).subscribe(
      (response) => {
        this.showBarChart6(response);
      },
      (err) => {
        console.error(err.error);
      }
    );
  }

  private patientStatusAverage() {
    let careHomeId = Number(
      JSON.parse(localStorage.getItem('_identity')).careHomeId
    );
    let userId = null;
    if (this.currentUserRole != this.userType.Admin) {
      userId = this.currentUserId;
    }
    this.dashboardService.patientStatusAverage(careHomeId, userId).subscribe(
      (response) => {
        this.showChart9(response);
      },
      (err) => {
        console.error(err.error);
      }
    );
  }

  // Service user audit forms due
  private showBarChart0(graphData) {
    document.getElementById('chart-0').remove(); // this is my <canvas> element
    document.getElementById('graph-container-0').innerHTML =
      '<canvas id="chart-0"></canvas>';
    let labes =
      graphData.length > 0 ? Object.keys(graphData[0].monthlyCounts) : ['-'];
    let dataSet = [];
    graphData.forEach((element) => {
      let data = {
        label: element.userName,
        backgroundColor:
          '#' + Math.floor(Math.random() * 16777215).toString(16),
        data: Object.values(element.monthlyCounts),
      };
      dataSet.push(data);
    });

    const data = {
      labels: labes,
      datasets: dataSet,
    };

    new Chart('chart-0', {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        scales: {
          xAxes: { stacked: true },
          yAxes: {
            stacked: true,
            beginAtZero: true
          },
        },
      },
    });
  }

  // Location audit forms due
  private showBarChart2(graphData) {
    document.getElementById('chart-1').remove(); // this is my <canvas> element
    document.getElementById('graph-container-1').innerHTML =
      '<canvas id="chart-1"></canvas>';
    let label =
      graphData.length > 0 ? Object.keys(graphData[0].monthlyCounts) : ['-'];
    let dataSet = [];
    graphData.forEach((element) => {
      let data = {
        label: element.userName,
        backgroundColor:
          '#' + Math.floor(Math.random() * 16777215).toString(16),
        data: Object.values(element.monthlyCounts),
      };
      dataSet.push(data);
    });

    const data = {
      labels: label,
      datasets: dataSet,
    };

    new Chart('chart-1', {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        scales: {
          xAxes: { stacked: true },
          yAxes: {
            beginAtZero: true,
            stacked: true,
          },
        },
      },
    });
  }

  // Timeline of upcoming risk assessment
  private showBarChart3(graphData) {
    document.getElementById('chart-3').remove(); // this is my <canvas> element
    document.getElementById('graph-container-3').innerHTML =
      '<canvas id="chart-3"></canvas>';
    let label =
      graphData.length > 0 ? Object.keys(graphData[0].monthlyCount) : ['-'];
    let dataSet = [];
    graphData.forEach((element) => {
      let data = {
        label: element.userName,
        backgroundColor:
          '#' + Math.floor(Math.random() * 16777215).toString(16),
        data: Object.values(element.monthlyCount),
      };
      dataSet.push(data);
    });

    const data = {
      labels: label,
      datasets: dataSet,
    };

    new Chart('chart-3', {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        scales: {
          xAxes: { stacked: true },
          yAxes:
          {
            beginAtZero: true,
            stacked: true,
          },
        },
      },
    });
  }

  // Active service users-last 12 months
  private showLineChart4(graphData) {
    document.getElementById('chart-4').remove(); // this is my <canvas> element
    document.getElementById('graph-container-4').innerHTML =
      '<canvas id="chart-4"></canvas>';
    if (!graphData) {
      return;
    }
    let label =
      graphData.length > 0
        ? Object.keys(graphData[0].dateWithActiveCount)
        : ['-'];
    // let dataSet = [];
    // graphData.forEach(element => {
    //   let data = {
    //     label: element.userName,
    //     backgroundColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
    //     data: Object.values(element.monthlyAuditCount)
    //   }
    //   // dataSet.push(data);
    // });
    //
    const data = {
      labels: label,
      datasets: [
        {
          label: 'Active service users last 12month ',
          data: Object.values(graphData[0].dateWithActiveCount),
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    };

    new Chart('chart-4', {
      type: 'line',
      data: data,
      options: {
        scales: {
          yAxes:
          {
            beginAtZero: true,
          },
        },
      },
    });
  }

  // Upcoming care plans
  private showBarChart5(graphData) {
    document.getElementById('chart-5').remove(); // this is my <canvas> element
    document.getElementById('graph-container-5').innerHTML =
      '<canvas id="chart-5"></canvas>';
    let label =
      graphData.length > 0 ? Object.keys(graphData[0].monthlyCounts) : ['-'];
    let dataSet = [];
    graphData.forEach((element) => {
      let data = {
        label: element.userName,
        backgroundColor:
          '#' + Math.floor(Math.random() * 16777215).toString(16),
        data: Object.values(element.monthlyCounts),
      };
      dataSet.push(data);
    });

    const data = {
      labels: label,
      datasets: dataSet,
    };

    new Chart('chart-5', {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        scales: {
          xAxes: { stacked: true },
          yAxes:
          {
            beginAtZero: true,
            stacked: true,
          },

        },
      },
    });
  }

  // Upcoming Medication
  private showBarChart6(graphData) {
    document.getElementById('chart-6').remove(); // this is my <canvas> element
    document.getElementById('graph-container-6').innerHTML =
      '<canvas id="chart-6"></canvas>';
    let label =
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
      labels: label,
      datasets: dataSet,
    };

    new Chart('chart-6', {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        scales: {
          xAxes: { stacked: true },
          yAxes:
          {
            beginAtZero: true,
            stacked: true,
          },

        },
      },
    });
  }

  private getPatients() {
    let careHomeId = Number(
      JSON.parse(localStorage.getItem('_identity')).careHomeId
    );
    this.patientService.getPatientsWithAlert(careHomeId).subscribe(
      (response) => {
        if (response.length > 0) {
          this.patients = response;
        }
        this.SetLoading(false);
      },
      (error) => {
        this.SetLoading(false);
        alert(error.error);
      }
    );
  }

  private showChart9(graphData) {
    document.getElementById('chart-11').remove(); // this is my <canvas> element
    document.getElementById('graph-container-11').innerHTML =
      '<canvas id="chart-11"></canvas>';
    let label = graphData ? Object.keys(graphData.dateWithAverage) : ['-'];
    // let dataSet = [];
    // graphData.forEach(element => {
    //   let data = {
    //     label: element.userName,
    //     backgroundColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
    //     data: Object.values(element.monthlyAuditCount)
    //   }
    //   // dataSet.push(data);
    // });
    //
    const data = {
      labels: label,
      datasets: [
        {
          label: 'Active service users last 12month ',
          data: Object.values(graphData.dateWithAverage),
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    };

    new Chart('chart-11', {
      type: 'line',
      data: data,
      options: {
        scales: {
          yAxes:
          {
            beginAtZero: true,
          },

        },
      },
    });
  }
}

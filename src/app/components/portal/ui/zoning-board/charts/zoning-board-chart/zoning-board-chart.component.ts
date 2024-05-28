import { Component, Input, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { PatientAlertService } from 'src/app/services/patient-alert.service';
import { PatientService } from 'src/app/services/patient.service';
import { ZoneCategory } from 'src/app/shared/enums/zone-category.enum';

@Component({
  selector: 'app-zoning-board-chart',
  templateUrl: './zoning-board-chart.component.html',
  styleUrls: ['./zoning-board-chart.component.scss'],
})
export class ZoningBoardChartComponent implements OnInit {
  @Input() locationId: number;

  public ZoneCount: Array<number> = [];

  constructor(
    private patientService: PatientService,
    private patientAlertService: PatientAlertService
  ) { }
  ngOnInit(): void { }

  // options = {
  //   maintainAspectRatio: true,
  //   spanGaps: false,
  //   elements: {
  //     line: {
  //       tension: 0.000001
  //     }
  //   },
  //   plugins: {
  //     filler: {
  //       propagate: false
  //     },
  //     'samples-filler-analyser': {
  //       target: 'chart-analyser'
  //     }
  //   },
  //   scale: {
  //     ticks: {
  //       suggestedMin: -1,
  //       suggestedMax: 10
  //     }
  //   }
  // };

  ngOnChanges(): void {
    if (this.locationId) {
      this.patientCount();
      this.alertCounts();
    }
  }

  prepareData(data: Array<number>) {
    let ret = [];
    data.forEach((element) => {
      ret.push(element);
      ret.push(0);
    });

    return ret;
  }

  private patientCount() {
    this.patientService.getPatientZoneCount(this.locationId).subscribe(
      (response) => {
        this.ZoneCount = [];
        if (response) {
          var result = response.reduce(function (obj, item) {
            obj[item.zoningCategory] = item.cnt;
            return obj;
          }, {});
          // [A:50,G:50,R:50]
          //  [50,20,30];
          if (result.A) {
            this.ZoneCount.push(result.A);
          } else {
            this.ZoneCount.push(0);
          }
          if (result.G) {
            this.ZoneCount.push(result.G);
          } else {
            this.ZoneCount.push(0);
          }
          if (result.R) {
            this.ZoneCount.push(result.R);
          } else {
            this.ZoneCount.push(0);
          }
          this.showPaiChart();
        }
      },
      (err) => {
        alert(err.error);
      }
    );
  }

  private alertCounts() {
    this.patientAlertService.chartService1(this.locationId).subscribe(
      (response) => {
        if (response) {
          this.showBarChart(response);
        }
      },
      (err) => {
        alert(err.error);
      }
    );
  }

  private showPaiChart() {
    document.getElementById('chart-0').remove(); // this is my <canvas> element
    document.getElementById('graph-container-0').innerHTML =
      '<canvas id="chart-0"></canvas>';
    document.getElementById('chart-0').innerHTML = '';
    const data = {
      labels: ['Amber', 'Green', 'Red'],
      datasets: [
        {
          label: 'My First Dataset',
          data: this.ZoneCount,
          backgroundColor: [
            'rgb(255, 204, 102)',
            'rgb(0, 255, 0)',
            'rgb(255 102 102)',
          ],
        },
      ],
    };

    new Chart('chart-0', {
      type: 'pie',
      data: data,
      // options: this.options
    });
  }

  private showBarChart(counts) {
    document.getElementById('chart-1').remove(); // this is my <canvas> element
    document.getElementById('graph-container-1').innerHTML = '<canvas id="chart-1"></canvas>';

    const data = {
      labels: ['Overdue', 'Upcoming in 3 days'],
      datasets: [
        {
          label: 'Patient Alerts',
          data: [counts.overdue, counts.upcoming_3_days],
          backgroundColor: ['rgb(255 102 102)', 'rgb(255, 204, 102)'],
          borderColor: ['rgb(255 102 102)', 'rgb(255, 204, 102)'],
          borderWidth: 1,
        },
      ],
    };

    new Chart('chart-1', {
      type: 'bar',
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
          ticks: { min: 0 },
        },
      },
    });
  }
}

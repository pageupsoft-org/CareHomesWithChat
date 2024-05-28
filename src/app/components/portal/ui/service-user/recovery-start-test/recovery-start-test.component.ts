import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-recovery-start-test',
  templateUrl: './recovery-start-test.component.html',
  styleUrls: ['./recovery-start-test.component.scss']
})

export class RecoveryStartTestComponent implements OnChanges {
  @Input() patientScores: any;
  @Input() userScores: any

  starData1: Array<number>;
  starData2: Array<number>;

  constructor() { }


  options = {
    maintainAspectRatio: true,
    spanGaps: false,
    elements: {
      line: {
        tension: 0.000001
      }
    },
    plugins: {
      filler: {
        propagate: false
      },
      'samples-filler-analyser': {
        target: 'chart-analyser'
      }
    },
    scale: {
      ticks: {
        suggestedMin: -1,
        suggestedMax: 10
      }
    }
  };

  ngOnChanges(): void {
    this.starData1 = this.patientScores;
    this.starData2 = this.userScores;
    const data = {
      labels: ['Managing Mental Health',
        '',
        'Self-Care',
        '',
        'Living Skills',
        '',
        'Social Networks',
        '',
        'Work',
        '',
        'Relationships',
        '',
        'Addictive Behaviour',
        '',
        'Responsibilities',
        '',
        'Identity & Self-Esteem',
        '',
        'Trust & Hope',
        ''
      ],
      datasets: [{
        backgroundColor: "#ffcccc",
        borderColor: "red",
        label: 'Patient Score',
        data: this.prepareData(this.starData1)
      }, {
        backgroundColor: "#ccccff",
        borderColor: "blue",
        label: 'Staff Score',
        data: this.prepareData(this.starData2)
      }]
    };

    new Chart('chart-0', {
      type: 'radar',
      data: data,
      options: this.options
    });
  }

  prepareData(data: Array<number>) {
    let ret = [];
    data.forEach(element => {
      ret.push(element);
      ret.push(0);
    });

    return ret;
  }

}

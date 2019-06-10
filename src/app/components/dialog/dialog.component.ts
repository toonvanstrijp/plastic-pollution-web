import {AfterViewInit, Component, HostListener, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html'
})
export class DialogComponent implements AfterViewInit {

  public json: string;
  private readonly graph: any;
  private chart: Chart;

  constructor(
      @Inject(MAT_DIALOG_DATA) private data: any[]
  ) {
    this.json = JSON.stringify(this.data, null, 4);

    this.graph = this.data.reduce((a, b) => {
      a[0].y += Math.ceil(b.properties.CD1____KM_);
      a[1].y += Math.ceil(b.properties.CD2____KM_);
      a[2].y += Math.ceil(b.properties.CD3____KM_);
      a[3].y += Math.ceil(b.properties.CD4____KM_);

      return a;
    }, [
      {x: 'CD1____KM_', y: 0},
      {x: 'CD2____KM_', y: 0},
      {x: 'CD3____KM_', y: 0},
      {x: 'CD4____KM_', y: 0},
    ]);
  }

  @HostListener('window:resize')
  onResize() {
    if (this.chart) {
      this.chart.resize();
    }
  }

  ngAfterViewInit() {
    // @ts-ignore
    this.chart = new Chart('plasticChart', {
      type: 'doughnut',
      data: {
        labels: ['0.33 - 1.00 mm', '1.01 - 4.75 mm', '4.76 - 200 mm', 'over 200mm'],
        datasets: [
          {
            label: 'Pieces of plastic',
            data: this.graph.map(p => p.y),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(153, 102, 255, 0.2)',
            ],
            borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(153, 102, 255, 1)',
            ],
            borderWidth: 1
          }
        ],
      },
      options: {
        title: {
          display: true,
          text: 'Pieces of plastic'
        }
      }
    });
  }
}

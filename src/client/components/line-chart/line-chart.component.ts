import { Component, ElementRef, Input, OnInit, ViewChild, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { Chart, ChartData, ChartDataSets } from 'chart.js';
import { GamePersonStatsDto } from 'src/shared';
import * as moment from 'moment';

@Component({
  selector: 'app-line-chart',
  template: `
    <div class="container">
      <canvas #canvas></canvas>
    </div>
  `,
  styles: [
    `
      .container {
        height: 300px;
        position: relative;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineChartComponent implements OnChanges {
  @Input()
  data: GamePersonStatsDto[];

  @ViewChild('canvas')
  private canvasRef: ElementRef;

  private chart: Chart | undefined;

  public ngOnChanges() {
    if (this.chart) {
      this.chart.destroy();
    }

    if (!this.data) {
      return;
    }

    const awardPoints: number[] = [];
    const killPoints: number[] = [];
    const points: number[] = [];
    const average: number[] = [];
    const labels: string[] = [];

    this.data
      .sort((a, b) => a.game.startTime.getTime() - b.game.startTime.getTime())
      .forEach(s => {
        labels.push(moment(s.game.startTime).format('DD.MM HH:mm'));
        const a = (s.awardPoints / s.seconds) * 60;
        const k = (s.killPoints / s.seconds) * 60;

        awardPoints.push(a);
        killPoints.push(k);
        points.push(a + k);
      });

    for (let i = 2; i < points.length - 2; i++) {
      average[i] = (points[i + 2] + points[i + 1] + points[i] + points[i - 1] + points[i - 2]) / 5;
    }

    const ctx = (this.canvasRef.nativeElement as HTMLCanvasElement).getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Points (per minute)',
            data: points,
            borderColor: '#388e3c',
            fill: false
          },
          {
            label: 'Average',
            data: average,
            borderColor: '#388e3c',
            borderDash: [2, 5],
            fill: false,
            pointRadius: 1
          },
          {
            label: 'Award Points',
            data: awardPoints,
            borderColor: '#f0f4c3',
            fill: false
          },
          {
            label: 'Kill Points',
            data: killPoints,
            borderColor: '#ffccbc',
            fill: false
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });
  }
}

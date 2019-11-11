import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { GamePersonStatsDto } from 'src/shared';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

@Component({
  selector: 'app-am-charts',
  template: `
    <div class="container" #container></div>
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
export class AmChartsComponent implements OnChanges {
  @Input()
  data: GamePersonStatsDto[];

  @ViewChild('container')
  private containerRef: ElementRef;

  public ngOnChanges() {
    if (!this.data) {
      return;
    }

    const charData: { date: Date; points: number; i: number }[] = [];

    this.data
      .sort((a, b) => a.game.startTime.getTime() - b.game.startTime.getTime())
      .forEach((s, i) => {
        // labels.push(moment(s.game.startTime).format('DD.MM HH:mm'));
        // const a = (s.awardPoints / s.seconds) * 60;
        // const k = (s.killPoints / s.seconds) * 60;

        // awardPoints.push(a);
        // killPoints.push(k);
        // points.push(a + k);
        charData.push({
          i,
          date: s.game.startTime,
          points: (s.killPoints / s.seconds) * 60
        });
      });

    const chart = am4core.create(this.containerRef.nativeElement, am4charts.XYChart);

    chart.data = charData;

    // Create axes
    const xAxis = chart.xAxes.push(new am4charts.ValueAxis());
    xAxis.min = 0;

    chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    const pointSeries = chart.series.push(new am4charts.LineSeries());
    pointSeries.dataFields.valueX = 'i';
    pointSeries.dataFields.valueY = 'points';
    pointSeries.tensionX = 0.8;
    pointSeries.tooltipText = '{points}';
    pointSeries.tooltip.pointerOrientation = 'vertical';

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = 'panX';
    chart.cursor.snapToSeries = pointSeries;
    chart.cursor.xAxis = xAxis;

    chart.scrollbarX = new am4core.Scrollbar();
  }
}

import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardModule} from 'primeng/card';
import {ChartModule} from 'primeng/chart';
import {SkeletonModule} from 'primeng/skeleton';
import {MonthlyGrosses} from '@core/models';
import {DateUtils, DistanceUtils} from '@shared/utils';
import {ApiService} from '@core/services';


@Component({
  selector: 'app-truck-grosses-barchart',
  standalone: true,
  templateUrl: './truck-grosses-barchart.component.html',
  styleUrls: ['./truck-grosses-barchart.component.scss'],
  imports: [
    CommonModule,
    CardModule,
    SkeletonModule,
    ChartModule,
  ],
})
export class TruckGrossesBarchartComponent implements OnInit {
  public isLoading: boolean;
  public monthlyGrosses?: MonthlyGrosses;
  public chartData: any;
  public chartOptions: any;

  @Input({required: true}) truckId!: string;
  @Output() chartDrawn = new EventEmitter<BarChartDrawnEvent>;

  constructor(private apiService: ApiService) {
    this.isLoading = false;

    this.chartOptions = {
      plugins: {
        legend: {
          display: false,
        },
      },
    };

    this.chartData = {
      labels: [],
      datasets: [
        {
          label: 'Monthly Gross',
          data: [],
        },
      ],
    };
  }

  ngOnInit(): void {
    this.fetchMonthlyGrosses();
  }

  private fetchMonthlyGrosses() {
    this.isLoading = true;
    const thisYear = DateUtils.thisYear();

    this.apiService.getMonthlyGrosses(thisYear, undefined, this.truckId).subscribe((result) => {
      if (result.success && result.value) {
        this.monthlyGrosses = result.value;
        const rpm = this.monthlyGrosses.totalIncome / DistanceUtils.metersTo(this.monthlyGrosses.totalDistance, 'mi');

        this.drawChart(this.monthlyGrosses);
        this.chartDrawn.emit({monthlyGrosses: this.monthlyGrosses, rpm: rpm});
      }

      this.isLoading = false;
    });
  }

  private drawChart(grosses: MonthlyGrosses) {
    const labels: Array<string> = [];
    const data: Array<number> = [];

    grosses.months.forEach((i) => {
      labels.push(DateUtils.getMonthName(i.month));
      data.push(i.income);
    });

    this.chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Monthly Gross',
          data: data,
          fill: true,
          tension: 0.4,
          backgroundColor: '#EC407A',
        },
      ],
    };
  }
}

export interface BarChartDrawnEvent {
  monthlyGrosses: MonthlyGrosses;
  rpm: number;
}

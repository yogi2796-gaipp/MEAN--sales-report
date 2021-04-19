import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { ApiService } from '../api.service';
import { Sales } from '../sales';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {
  socket = io('http://localhost:4000');
  chartData: Sales[] = [];

  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public pieChartLabels: Label[] = [];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [];

  displayedColumns: string[] = ['itemId', 'itemName', 'totalPrice'];
  data: Sales[] = [];
  isLoadingResults = true;


  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.getSales();
    this.getChartData();

    // tslint:disable-next-line:typedef
    this.socket.on('update-data', function(data: any) {
      this.getSales();
      this.getChartData();
    }.bind(this));
  }

  // tslint:disable-next-line:typedef
  getSales() {
    this.api.getSales()
    .subscribe((res: any) => {
      this.data = res;
      console.log(this.data);
      this.isLoadingResults = false;
    }, err => {
      console.log(err);
      this.isLoadingResults = false;
    });
  }

  // tslint:disable-next-line:typedef
  getChartData() {
    this.api.getChart()
    .subscribe((res: any) => {
      console.log(res);
      this.chartData = res;
      this.pieChartLabels = [];
      this.pieChartData = [];
      this.pieChartColors = [];
      const backgrounds = [];
      this.chartData.forEach((ch, idx) => {
        this.pieChartLabels.push(ch?._id?.itemName);
        this.pieChartData.push(ch?.totalPrice);
        backgrounds.push(`rgba(${0 + (idx * 10)}, ${255 - (idx * 20)}, ${0 + (idx * 10)}, 0.3)`);
      });
      this.pieChartColors = [
        {
          backgroundColor: backgrounds
        }
      ];
    }, err => {
      console.log(err);
    });
  }

}

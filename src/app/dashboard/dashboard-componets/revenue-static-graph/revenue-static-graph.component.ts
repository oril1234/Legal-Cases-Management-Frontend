import { Component, OnInit } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { from } from 'rxjs';
import {Chart} from 'chart.js'


@Component({
  selector: 'app-revenue-static-graph',
  templateUrl: './revenue-static-graph.component.html',
  styleUrls: ['./revenue-static-graph.component.css']
})
export class RevenueStaticGraphComponent implements OnInit {

    // lineChart
    public lineChartData: Array<object> = [
      { data: [8,13,1,13,1], label: 'Product A' },
      { data: [14,1,14,1,14], label: 'Product B' }
    ];
    public lineChartLabels: Array<string> = [
      '1',
      '2',
      '3',
      '4',
      '5',
    ];
    public lineChartOptions={
      responsive: true,
      maintainAspectRatio: false
    };
    public lineChartColors= [
      {
        // grey
        backgroundColor: 'rgba(0,158,251,0.1)',
        borderColor: '#009efb',
        pointBackgroundColor: '#009efb',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#009efb'
      },
      {
        // dark grey
        backgroundColor: 'rgba(85,206,99,0.1)',
        borderColor: '#55ce63',
        pointBackgroundColor: '#55ce63',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#55ce63'
      }
    ];
    public lineChartLegend = false;
    public lineChartType = 'line';

  constructor() { }

  ngOnInit(): void {
    var myChart = new Chart("myChart", {
      type: 'bar',
      data: {
          labels: ['יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר'],
          datasets: [{
              label: '# of Votes',
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          }
      }
  });

  }

}

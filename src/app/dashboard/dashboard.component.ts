import { Component, AfterViewInit } from '@angular/core';
import {DashboardService} from '../dashboard.service'
// import { ChartsModule } from 'ng2-charts';
declare var require: any;
@Component({
  templateUrl: './dashboard.component.html'
})




export class DashboardComponent implements AfterViewInit {
  subtitle: string;
  studentsNum=0;
  activeClinicsNum=0;
  supervisorsNum=0;
  casesReceivedThisYearNum=0;
  constructor(public dashservice:DashboardService) {
    this.subtitle = 'This is some text within a card block.';
    this.getStudentsNum()
    this.getNumberOfActiveClinics();
    this.getNumberOfSupervisors();
    this.getTotalNumberOfCasesPastYear();
    //this.getBetweenDates()
  }

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

  ngAfterViewInit() {}

  getStudentsNum()
  {
    this.dashservice.getStudentsNum().subscribe(
      data=>{
        this.studentsNum=data;
      }
    )
  }

  getNumberOfActiveClinics()
  {
    this.dashservice.getNumberOfActiveClinics().subscribe(
      data=>{
        this.activeClinicsNum=data;

      }
    )
  }

  getNumberOfSupervisors()
  {
    this.dashservice.getNumberOfClinicalSupervisors().subscribe(
      data=>
      {
        console.log("There is an answer");
        this.supervisorsNum=data;
      }
    )
  }

  getTotalNumberOfCasesPastYear()
  {
    this.dashservice.numberOfCasesReceivedThisPastYear().subscribe(
      data=>
      {
        this.casesReceivedThisYearNum=data;
      }
    )
  }

  getBetweenDates()
  {
    let date1=new Date();
    let date2=new Date();
    //let bDate=new BetweenDates();
    //bDate.startDate=date1;
    //bDate.endDate=date2;

    /*
    this.dashservice.numberOfCasesToCourtInAllClinicsBetween2Dates(bDate).subscribe(
      data=>{
        console.log("Data is "+data)
      },
      error=>
      {
        console.log("error occured");
      }

    )
    */
  }


}

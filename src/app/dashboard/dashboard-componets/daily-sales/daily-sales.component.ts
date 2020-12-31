import { Component, OnInit,Input } from '@angular/core';
import { DashboardService } from 'src/app/dashboard.service';

@Component({
  selector: 'app-daily-sales',
  templateUrl: './daily-sales.component.html',
  styleUrls: ['./daily-sales.component.css']
})
export class DailySalesComponent implements OnInit {
  @Input() public  dashboardService!:DashboardService;
  public courtsCasesNumber!:number;


  constructor() { }

  ngOnInit(): void {
    this.getAllSCourtsCases()

  }

  getAllSCourtsCases()
  {
    this.dashboardService.getNumberOfCourtsCasesThisYear().subscribe( data =>{
      this.courtsCasesNumber=data;
      
    },
    error => console.log(error)
    );


  }
}

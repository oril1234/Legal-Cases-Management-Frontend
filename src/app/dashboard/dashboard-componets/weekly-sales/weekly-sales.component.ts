import { Component, Input, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/dashboard.service';

@Component({
  selector: 'app-weekly-sales',
  templateUrl: './weekly-sales.component.html',
  styleUrls: ['./weekly-sales.component.css']
})
export class WeeklySalesComponent implements OnInit {

  @Input() public  dashboardService!:DashboardService;
  public closedCasesNumber!:number;
  constructor() { 
  }

  ngOnInit(): void {
    this.getAllSClosedCases()

  }

  getAllSClosedCases()
  {
    this.dashboardService.getNumberOfClosedCasesThisYear().subscribe( data =>{
      this.closedCasesNumber=data;
      
    },
    error => console.log(error)
    );


  }

}

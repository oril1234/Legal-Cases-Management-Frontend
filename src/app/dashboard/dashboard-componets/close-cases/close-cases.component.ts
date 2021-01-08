import { Component, Input, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/dashboard.service';

@Component({
  selector: 'app-close-cases',
  templateUrl: './close-cases.component.html',
  styleUrls: ['./close-cases.component.css']
})
export class CloseCasesComponent implements OnInit {

  closedCasesNumber:number=0;
  constructor(private dashboardService:DashboardService) { 
    this.getClosedCasesLastPastYear();
  }


  ngOnInit(): void {
  }

  getClosedCasesLastPastYear()
  {
    this.dashboardService.getNumberOfClosedCasesPassedYear().subscribe(
      data=>{
        this.closedCasesNumber=data;
      },
      err=>{
        
      }
    )
  }

}


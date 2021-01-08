import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/dashboard.service';


@Component({
  selector: 'app-case-in-court',
  templateUrl: './case-in-court.component.html',
  styleUrls: ['./case-in-court.component.css']
})
export class CaseInCourtComponent implements OnInit {

  caseInCourtNumber:number=0;
  constructor(private dashboardService:DashboardService) {

   }

  ngOnInit(): void {
  }

  getNumberOfCasesInCouret()
  {
    //this.dashboardService.court
  }

}

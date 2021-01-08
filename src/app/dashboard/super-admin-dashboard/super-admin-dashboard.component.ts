import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/dashboard.service';

@Component({
  selector: 'app-super-admin-dashboard',
  templateUrl: './super-admin-dashboard.component.html',
  styleUrls: ['./super-admin-dashboard.component.css']
})
export class SuperAdminDashboardComponent implements OnInit {
studentsNumber:number=0;
activeClinicsNumber:number=0;
supervisorsNumber:number=0;
casesReceivedThisYearNumber:number=0
  constructor(private dashBoardService:DashboardService) { 

    this.getTotalNumberOfStudents();
    this.getTotalNumberOfActiveClinics();
    this.getTotalNumberOfSuperVisors();
    this.getTotalNumberOfCaseReceivedThisYear()
  }

  ngOnInit(): void {
  }

  getTotalNumberOfStudents()
  {
    this.dashBoardService.getStudentsNum().subscribe(
      data=>{
        this.studentsNumber=data;
      }
    )
  }

  getTotalNumberOfActiveClinics()
  {
    this.dashBoardService.getNumberOfActiveClinics().subscribe(
      data=>{
        this.activeClinicsNumber=data;
      }
    )
  }

  getTotalNumberOfSuperVisors()
  {
    this.dashBoardService.getNumberOfClinicalSupervisors().subscribe(
      data=>{
        this.supervisorsNumber=data;
      }
    )
  }

  getTotalNumberOfCaseReceivedThisYear()
  {
    this.dashBoardService.numberOfCasesReceivedThisPastYear().subscribe(
      data=>
      {
        this.casesReceivedThisYearNumber=data;
      }
    )
  }

}

import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';

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
  constructor(private httpService:HttpService) { 

    this.getTotalNumberOfStudents();
    this.getTotalNumberOfActiveClinics();
    this.getTotalNumberOfSuperVisors();
    this.getTotalNumberOfCaseReceivedThisYear()
  }

  ngOnInit(): void {
  }

  getTotalNumberOfStudents()
  {
    this.httpService.getStudentsNum().subscribe(
      data=>{
        this.studentsNumber=data;
      }
    )
  }

  getTotalNumberOfActiveClinics()
  {
    this.httpService.getNumberOfActiveClinics().subscribe(
      data=>{
        this.activeClinicsNumber=data;
      }
    )
  }

  getTotalNumberOfSuperVisors()
  {
    this.httpService.getNumberOfClinicalSupervisors().subscribe(
      data=>{
        this.supervisorsNumber=data;
      }
    )
  }

  getTotalNumberOfCaseReceivedThisYear()
  {
    this.httpService.numberOfCasesReceivedThisPastYear().subscribe(
      data=>
      {
        this.casesReceivedThisYearNumber=data;
      }
    )
  }

}

import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/dashboard.service';
import jwt_decode from 'jwt-decode'


@Component({
  selector: 'app-supervisor-dashboard',
  templateUrl: './supervisor-dashboard.component.html',
  styleUrls: ['./supervisor-dashboard.component.css']
})
export class SupervisorDashboardComponent implements OnInit {

  studentsNumber:number=0;
  activeClinicsNumber:number=0;
  supervisorsNumber:number=0;
  casesReceivedThisYearNumber:number=0
  clinicName=""
  


  constructor(private dashBoardService:DashboardService) {
    
    
    
    this.getTotalNumberOfStudentsInClinic();
    this.getTotalNumberOfStudentsInClinic();
    this.getTotalNumberOfStudentsInClinic();
    this.getTotalNumberOfStudentsInClinic();
    
   }

  ngOnInit(): void {
  }


  getClinicNameBySupervisor()
  {
    let decoded=jwt_decode(localStorage.getItem("authenticationToken")+"")
    let id:number=parseInt(JSON.parse(JSON.stringify(decoded)+"").sub);

    this.dashBoardService.getClinicNameBySupervisorId(id).subscribe(
      data=>
      {
        this.clinicName=data;
        
      }

    )

  }

  getTotalNumberOfStudentsInClinic()
  {
    this.dashBoardService.getStudentsNum().subscribe(
      data=>{
        this.studentsNumber=data;
      }
    )
  }

  getTotalNumberOfCaseReceivedThisYear()
  {
    
    this.dashBoardService.numberOfCasesReceivedThisPastYearByClinic("").subscribe(
      data=>
      {
        
      }
    )
  }

}

import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/dashboard.service';
import jwt_decode from 'jwt-decode'
import { Student } from 'src/app/_models/student';


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
    
    this.numberOfClinicsToCourt2Dates();
    
    this.getTotalNumberOfStudentsInClinic();
    /*
    this.getTotalNumberOfStudentsInClinic();
    this.getTotalNumberOfStudentsInClinic();
    this.getTotalNumberOfStudentsInClinic();
    */
   }

  ngOnInit(): void {
  }


  numberOfClinicsToCourt2Dates()
  {
    /*
    this.dashBoardService.numberOfCasesToCourtInChosenClinicBetween2Dates().subscribe(
      data=>{
      },
      error=>{
      }
    )
    */
  }

  /*
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
  */

  getTotalNumberOfStudentsInClinic()
  {
    let id=JSON.parse(JSON.stringify(jwt_decode(localStorage.getItem("authenticationToken")+""))).sub;

    this.dashBoardService.getAllStudents().subscribe(
      data=>{
        let students:Student[]=data.filter(student=>student.clinicalSupervisorName==id);
        
        this.studentsNumber=students.length;
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

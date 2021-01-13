import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'ng2-charts';
import { DashboardService } from 'src/app/dashboard.service';
import jwt_decode from 'jwt-decode'
import { ClinicalSupervisor } from 'src/app/_models/clinical-supervisor';



@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {

  casesAssignedStudentNumber:number=0;
  supervisor!:ClinicalSupervisor

  constructor(private dashboardService:DashboardService) {
    this.getAllMyCases();
    this.getNumberOfCasesByChosenClinic();
    this.getClinicalSupervisor();
    
   }

  ngOnInit(): void {
  }


  getAllMyCases()
  {
   
    let id=JSON.parse(JSON.stringify(jwt_decode(localStorage.getItem("authenticationToken")+""))).sub;
    this.dashboardService.getNumberOfCasesAssignedToStudent(id).subscribe(
     data=>
     {
      this.casesAssignedStudentNumber=data;
     }
   )
  }



  getNumberOfCasesByChosenClinic()
  {
    
  }


  getClinicalSupervisor()
  {
    let id=JSON.parse(JSON.stringify(jwt_decode(localStorage.getItem("authenticationToken")+""))).sub;
    this.dashboardService.getStudentClinicalSupervisorByStudentId(id).subscribe(
      data=>{
        this.supervisor=data;
      },
      err=>{
      }
    )
  }
  

}

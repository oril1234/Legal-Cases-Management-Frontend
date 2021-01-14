import { Component, OnInit } from "@angular/core";
import { ThemeService } from "ng2-charts";
import { DashboardService } from "src/app/dashboard.service";
import jwt_decode from "jwt-decode";
import { ClinicalSupervisor } from "src/app/_models/clinical-supervisor";
import { LegalCaseCounter } from "src/app/_models/legal-case-counter";
import { LegalCase } from "src/app/_models/legal-case";

@Component({
  selector: "app-student-dashboard",
  templateUrl:'./student-dashboard.component.html',
  styleUrls: ["./student-dashboard.component.css"],
})
export class StudentDashboardComponent implements OnInit {
  casesAssignedStudentNumber: number = 0;
  totalCasesInClinic:number=0
  supervisor!: ClinicalSupervisor;

  constructor(private dashboardService: DashboardService) {
    this.getAllMyCases();
    this.getNumberOfCasesByChosenClinic();
    this.getClinicalSupervisor();
  }

  ngOnInit(): void {}

  getAllMyCases() {
    let id = JSON.parse(
      JSON.stringify(
        jwt_decode(localStorage.getItem("authenticationToken") + "")
      )
    ).sub;
    this.dashboardService
      .getNumberOfCasesAssignedToStudent(id)
      .subscribe((data) => {
        this.casesAssignedStudentNumber = data;
      });

      
  }

  getNumberOfCasesByChosenClinic() {}

  getClinicalSupervisor() {
    let id = JSON.parse(
      JSON.stringify(
        jwt_decode(localStorage.getItem("authenticationToken") + "")
      )
    ).sub;
    this.dashboardService.getStudentClinicalSupervisorByStudentId(id).subscribe(
      (data) => {
        this.supervisor = data;
        this.dashboardService.getAllCases().subscribe(
          data1=>{
            let cases:LegalCase[]=data1;
            this.dashboardService.getAllClinic().subscribe(
              data2=>{
                data2=data2.filter(superv=>superv.clinicalSupervisorId==this.supervisor.id);
                cases=cases.filter(lCase=>lCase.clinicName==data2[0].clinicName);
                this.totalCasesInClinic=cases.length;
              }
            )
          }
        )
      },
      (err) => {
        alert("just an error!")
      }
    );
  }
}

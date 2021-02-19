import { Component, OnInit } from "@angular/core";
import { ThemeService } from "ng2-charts";
import { HttpService } from "src/app/http.service";
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

  constructor(private httpService: HttpService) {
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
    this.httpService
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
    this.httpService.getStudentClinicalSupervisorByStudentId(id).subscribe(
      (data) => {
        this.supervisor = data;
        this.httpService.getAllCases().subscribe(
          data1=>{
            let cases:LegalCase[]=data1;
            this.httpService.getAllClinic().subscribe(
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

      }
    );
  }
}

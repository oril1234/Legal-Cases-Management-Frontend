import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/dashboard.service';
import jwt_decode from 'jwt-decode'
import { Student } from 'src/app/_models/student';
import { LegalCase } from 'src/app/_models/legal-case';
import { Research } from 'src/app/_models/research';
import { ClinicalSupervisor } from 'src/app/_models/clinical-supervisor';
import { Clinic } from 'src/app/_models/clinic';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BetweenDates } from 'src/app/_models/between-dates';




@Component({
  selector: 'app-supervisor-dashboard',
  templateUrl: './supervisor-dashboard.component.html',
  styleUrls: ['./supervisor-dashboard.component.css']
})
export class SupervisorDashboardComponent implements OnInit {
  closeResult=""
  startDate!:Date
  endDate!:Date

  id:number=0;
  studentsNumber:number=0;
  activeClinicsNumber:number=0;
  supervisorsNumber:number=0;
  casesReceivedThisYearNumber:number=0
  clinicName=""
  researchesNumber:number=0;
  casesInCourtNumber:number=0
  private pickerOptions: Object = {
    'showDropdowns': true,
    'showWeekNumbers': true,
    'timePickerIncrement': 5,
    'autoApply': true,
    'startDate': '04/27/2016',
    'endDate': '07/27/2016'
  };
  range=new FormGroup({
    start:new FormControl(),
    end:new FormControl(),
  })
  


  constructor(private dashBoardService:DashboardService,private modalService:NgbModal) {
    
    this.getClinicName();
   }

  ngOnInit(): void {
  }

  getClinicName()
  {
    this.id=parseInt(JSON.parse(JSON.stringify(jwt_decode(localStorage.getItem("authenticationToken")+""))).sub);
    this.dashBoardService.getAllClinic().subscribe(
      data=>{
      
        let clinics:Clinic[]=data;
        clinics=clinics.filter(clinic=>clinic.clinicalSupervisorId==this.id);
        if(clinics.length!=0)
        this.clinicName=clinics[0].clinicName;
          },
          err=> {
          },
          ()=>{
            this.getTotalNumberOfStudentsInClinic();
            this.getTotalNumberOfCaseReceivedThisYear();
            this.GetNumberOfResearchesInClinic();
          }
    )
  }

  	//Modal methodd
	open(content:string,String:string) {
		this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'dark-modal'}).result.then((result) => {
			this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

		});
		
	}

  private getDismissReason(reason: ModalDismissReasons): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return  `with: ${reason}`;
		}
	}

  getNumberOfCasesInCouret()
  {
    let between=new BetweenDates();
    between.startDate=this.startDate;
    between.endDate=this.endDate;

    this.dashBoardService.selectAllLegalCasesInCourt().subscribe(
      data=>{
        let cases:LegalCase[]=data;
        cases=cases.filter(lCase=>lCase.clinicName==this.clinicName);
        let start:Date=new Date(this.startDate+"");
        let end:Date=new Date(this.endDate+"");
        cases=cases.filter(lCase=>{
          let formatted=new Date(lCase.dateAdded+"")
        return formatted>start && formatted<end;
          });
        this.casesInCourtNumber=cases.length;            

      },
      err=>
      {
      }

    )
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

    this.dashBoardService.getAllStudents().subscribe(
      data=>{
        let students:Student[]=data.filter(student=>student.clinicalSupervisorId==this.id);
        
        this.studentsNumber=students.length;
      }
    )
  }

  getTotalNumberOfCaseReceivedThisYear()
  {
   

        
        this.dashBoardService.getAllCases().subscribe(
          data1=>
          {
                
              let cases:LegalCase[]=data1;
                cases=cases.filter(lCase=>lCase.clinicName==this.clinicName);
                var d = new Date();
                var pastYear = d.getFullYear() - 1;
                d.setFullYear(pastYear);

                cases=cases.filter(lCase=>{
                let formatted:Date=new Date(lCase.dateAdded+"");
                return formatted>d;
                  });
                this.casesReceivedThisYearNumber=cases.length;            
          },
          err=>{
                }

          )
  }

  GetNumberOfResearchesInClinic()
  {
    this.dashBoardService.getAllResearches().subscribe(
      data=>{
        let researches:Research[]=data;
        researches=researches.filter(research=> research.clinicName==this.clinicName);
        this.researchesNumber=researches.length;
      }
    )

  }
  dateRangeCreated($event:Date){

  }

}

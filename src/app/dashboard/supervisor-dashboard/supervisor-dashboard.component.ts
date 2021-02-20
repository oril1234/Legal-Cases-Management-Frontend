import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
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
})

/**
 * Component displayed when connected user is a clinical supervisor
 */
export class SupervisorDashboardComponent implements OnInit {
  
  //Reason to close modal window
  closeResult=""

  //Start date in a range of 2 dates
  startDate=new Date('2020-1-1');

  //End date in a range of 2 dates
  endDate=new Date('2021-1-1');

  //Id of connected user
  id:number=0;

  //Total number of students in clinic of clinical supervisor
  studentsNumber:number=0;

  //Total number of cases received this year
  casesReceivedThisYearNumber:number=0

  //Clinic name of clinical supervisor
  clinicName=""

  //Total number of researches in the clinic
  researchesNumber:number=0;

  //Total number of cases handled in court right now
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
  


  constructor(private httpService:HttpService,private modalService:NgbModal) {
    this.getClinicName();
   }

  ngOnInit(): void {
  }

  getClinicName()
  {
    this.id=parseInt(JSON.parse(JSON.stringify(jwt_decode(localStorage.getItem("authenticationToken")+""))).sub);
    this.httpService.getAllClinic().subscribe(
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
            this.getNumberOfCasesInCourtBetweenDates();
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

  //Get reason to close modal window
  private getDismissReason(reason: ModalDismissReasons): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return  `with: ${reason}`;
		}
	}

  getNumberOfCasesInCourtBetweenDates()
  {
    let between=new BetweenDates();
    between.startDate=this.startDate;
    between.endDate=this.endDate;


    this.httpService.numberOfCasesToCourtInChosenClinicBetween2Dates(this.clinicName, between).subscribe(
      data=>{
        this.casesInCourtNumber = data;

      },
      err=>
      {
      }

    )
  }


  getTotalNumberOfStudentsInClinic()
  {

    this.httpService.getAllStudents().subscribe(
      data=>{
        let students:Student[]=data.filter(student=>student.clinicalSupervisorId==this.id);
        
        this.studentsNumber=students.length;
      }
    )
  }

  getTotalNumberOfCaseReceivedThisYear()
  {
   

        
        this.httpService.getAllCases().subscribe(
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
    this.httpService.getAllResearches().subscribe(
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

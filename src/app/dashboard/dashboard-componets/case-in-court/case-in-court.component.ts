import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BetweenDates } from 'src/app/_models/between-dates';

@Component({
  selector: 'app-case-in-court',
  templateUrl: './case-in-court.component.html',
})

//This is a component of cases handled by court
export class CaseInCourtComponent implements OnInit {

  //Number of cases handled by court
  caseInCourtNumber:number=0;

  //Close result of a modal window
  closeResult="" 
  
  //Initial date to display results from
  startDate=new Date('2020-1-1');

  //End date to display results
  endDate=new Date('2021-1-1');

  constructor(private httpService:HttpService,private modalService:NgbModal) {
this.getNumberOfCasesInCourt();
   }

  ngOnInit(): void {
  }

  //Get number of all case handled by court
  getNumberOfCasesInCourt()
  {
    let between=new BetweenDates();
    between.startDate=this.startDate;
    between.endDate=this.endDate;

    this.httpService.numberOfCasesToCourtInAllClinicsBetween2Dates(between).subscribe(
      data=>{
        this.caseInCourtNumber=data;
      },
      err=>
      {
      }

    )
  }

  //Open modal method
  open(content:string,empty:string) {
		this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'dark-modal'}).result.then((result) => {
			this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

		});
		
	}

  //Reason for closing modal window
  private getDismissReason(reason: ModalDismissReasons): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return  `with: ${reason}`;
		}
	}




}

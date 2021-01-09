import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/dashboard.service';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BetweenDates } from 'src/app/_models/between-dates';



@Component({
  selector: 'app-case-in-court',
  templateUrl: './case-in-court.component.html',
  styleUrls: ['./case-in-court.component.css']
})
export class CaseInCourtComponent implements OnInit {

  caseInCourtNumber:number=0;
  closeResult=""
  startDate=new Date('2017-1-1');
  endDate=new Date('2021-1-1');

  constructor(private dashboardService:DashboardService,private modalService:NgbModal) {
this.getNumberOfCasesInCouret();
   }

  ngOnInit(): void {
  }

  getNumberOfCasesInCouret()
  {
    let between=new BetweenDates();
    between.startDate=this.startDate;
    between.endDate=this.endDate;

    this.dashboardService.numberOfCasesToCourtInAllClinicsBetween2Dates(between).subscribe(
      data=>{
        this.caseInCourtNumber=data;
        alert("HI!")
      },
      err=>
      {
        alert("error!")
      }

    )
  }

  open(content:string,empty:string) {
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




}

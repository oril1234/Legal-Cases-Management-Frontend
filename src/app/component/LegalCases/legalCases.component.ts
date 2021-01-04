import { Component, ViewChild } from '@angular/core';
import { NgbCarouselConfig, NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AssertNotNull } from '@angular/compiler';
import { DashboardService } from 'src/app/dashboard.service';
import { LegalCase } from 'src/app/_models/legal-case';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';
import { Clinic } from 'src/app/_models/clinic';




@Component({
	selector: 'app-ngbd-buttons-radio',
	templateUrl: './legalCases.html',
	providers: [NgbCarouselConfig]
})
export class LegalCasesComponent {
	cases!:LegalCase[];
	clinics!:Clinic[];

    closeResult="";

	casesForm = new FormGroup({
		id:new FormControl(''),
    subject:new FormControl(''),
	dateAdded:new FormControl(''),
		status: new FormControl(''),
		type:new FormControl(''),
		courtCaseId: new FormControl(''),
		clinicName: new FormControl(''),
		clientId:new FormControl('')

	  });

	constructor(private dashboardService: DashboardService,private modalService: NgbModal) {
		this.getAllClinics();
		this.getAllCases();

	}


	//Getting all the clinics for assigning new cases to specific clinic
	getAllClinics()
	{
		this.dashboardService.getAllClinic().subscribe(
			data=>{
				this.clinics=data;
			}
		)

	}

	getAllCases()
	{
		this.dashboardService.getAllCases().subscribe(
			data=> {
				this.cases=data;
				console.log(this.cases)
			}
				);
	}


	  	//Modal methodd
		  open(content:string,legalcase:LegalCase) {
			this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'dark-modal'}).result.then((result) => {
				this.closeResult = `Closed with: ${result}`;
			}, (reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
	
			});
			
		}
	
		openDeleteModal(firstName:string,lastName:string,id:string)
		{
	
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
	

	onSave()
	{


     const legalCase:LegalCase=new LegalCase();
     legalCase.id!=125;
	 legalCase.subject="business conflict";
     legalCase.dateAdded=new Date();
     legalCase.status="חדש";
     legalCase.type="פלילי";
     legalCase.courtCaseId=22;
     legalCase.clinicName="הקליניקה ליישוב סכסוכים ע״ש לאון צ׳רני";
     legalCase.clientId=23215455;

		 this.dashboardService.addNewCase(legalCase).subscribe(
			 
		 )
	}

  
	onDelete(id:string)
	{
		
		this.dashboardService.deleteCase(parseInt(id)).subscribe(

		);
	}

	onEdit()
	{
		const legalCase:LegalCase=new LegalCase();
		legalCase.id=parseInt(this.casesForm.get("id")?.value+"");
		legalCase.dateAdded=this.casesForm.get("dateAdded")?.value;
		legalCase.subject=this.casesForm.get("subject")?.value+"";
		legalCase.status=this.casesForm.get("status")?.value+"";
		legalCase.courtCaseId=parseInt(this.casesForm.get("courtCaseId")?.value+"");
		legalCase.clinicName=this.casesForm.get("clinicName")?.value+"";
		legalCase.clientId=parseInt(this.casesForm.get("clientId")?.value+"");
		legalCase.type=this.casesForm.get("type")?.value+"";
		alert(legalCase.type)
		
		this.dashboardService.editCase(legalCase).subscribe(
		
			 
		 )
		 
		
	}


}

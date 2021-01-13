import { Component, ViewChild,OnInit } from '@angular/core';
import { NgbCarouselConfig, NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AssertNotNull } from '@angular/compiler';
import { DashboardService } from 'src/app/dashboard.service';
import { LegalCase } from 'src/app/_models/legal-case';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';
import { Clinic } from 'src/app/_models/clinic';
import jwt_decode from "jwt-decode";
import { ActivatedRoute, Router } from '@angular/router';
import {Client} from '../../_models/client'
import { Roles } from 'src/app/_models/roles.enum';






@Component({
	selector: 'app-ngbd-buttons-radio',
	templateUrl: './legalCases.html',
	providers: [NgbCarouselConfig]
})
export class LegalCasesComponent implements OnInit{
	cases!:LegalCase[];
	clinics!:Clinic[];
	currenntRole=parseInt(localStorage.getItem('Role')+"");
    closeResult="";
	currentStatus=""
	currentClient:Client
	userId = parseInt(
		JSON.parse(
		  JSON.stringify(
			jwt_decode(localStorage.getItem("authenticationToken") + "")
		  )
		).sub);

	addedCase:LegalCase=new LegalCase()
	edittedCase:LegalCase=new LegalCase()	



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

	constructor(private dashboardService: DashboardService,private modalService: NgbModal,
		private route:ActivatedRoute,
		private router: Router
		) {
	
			if (this.route.snapshot.paramMap.get('status')) {
				this.currentStatus=this.route.snapshot.paramMap.get('')+"";
			}
		if(this.currenntRole==Roles.SUPERVISOR)
		{
			this.getAllClinics();
		}
		else
			this.getAllCases();

	}
	public ngOnInit(): void {
		this.router.routeReuseStrategy.shouldReuseRoute = () => false;
	
	  }


	//Getting all the clinics for assigning new cases to specific clinic
	getAllClinics()
	{
		this.dashboardService.getAllClinic().subscribe(
			data=>{
				this.clinics=data;
				this.clinics=this.clinics.filter(clinic=>clinic.clinicalSupervisorId==this.userId);
				this.getAllCases();
				
			}
		)

	}

	getAllCases()
	{
		
			
			if (this.route.snapshot.paramMap.get('status')=='allInCourt')
			this.dashboardService.selectAllLegalCasesInCourt().subscribe(
				data=> {
					this.cases=data;
					console.log(this.cases)
				}
					);
			else if(this.route.snapshot.paramMap.get('status')=='notInCourt') {
				this.dashboardService.selectAllLegalCasesNotInCourt().subscribe(
					data=> {
						this.cases=data;
						console.log(this.cases)
					}
						);
			}

			
			else if(this.currenntRole==Roles.SUPERVISOR)
			{
				this.dashboardService.getAllCases().subscribe(
					data=> {
						this.cases=data;
						this.cases=this.cases.filter(lCase=>lCase.clinicName==this.clinics[0].clinicName);

					}
						);
			}
		


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
	

		//Invoked when adding new case
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

  
	//Invoked for deleting case
	onDelete(id:string)
	{
		this.dashboardService.deleteCase(parseInt(id)).subscribe(

		);
	}


	//Invoked for updating a case
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
		
		this.dashboardService.editCase(legalCase).subscribe(
		
			 
		 )
		 
		
	}

	showDetails(id:number)
	{
		this.dashboardService.getClientNyId(id).subscribe(
			data=>
			{
				this.currentClient=data;
			}
		)
	}


}

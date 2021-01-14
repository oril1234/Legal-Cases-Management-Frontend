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
import { ClinicalSupervisor } from 'src/app/_models/clinical-supervisor';
import { NotificationType } from 'src/app/_models/notification-type.enum';
import { NotificationtsToUsers } from 'src/app/_models/notification';
import { NotificationManager } from 'src/app/_models/notification-manager';






@Component({
	selector: 'app-ngbd-buttons-radio',
	templateUrl: './legalCases.html',
	providers: [NgbCarouselConfig]
})
export class LegalCasesComponent implements OnInit{
	cases:LegalCase[];
	clinics:Clinic[];
	supervisors:ClinicalSupervisor[]
	currentSuperVisor:ClinicalSupervisor
	currentRole=parseInt(localStorage.getItem('Role')+"");
    closeResult="";
	currentStatus=""
	clinicName:string=""
	currentClient:Client
	userId = parseInt(
		JSON.parse(
		  JSON.stringify(
			jwt_decode(localStorage.getItem("authenticationToken") + "")
		  )
		).sub);
	userFullName:string=""	

	addedCase:LegalCase=new LegalCase()
	edittedCase:LegalCase=new LegalCase()	


	constructor(private dashboardService: DashboardService,private modalService: NgbModal,
		private route:ActivatedRoute,
		private router: Router
		) {
	
			if (this.route.snapshot.paramMap.get('status')) {
				this.currentStatus=this.route.snapshot.paramMap.get('')+"";
			}
		this.getAllClinics();	

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
				if(this.currentRole==Roles.SUPERVISOR)
				{
					this.clinics=this.clinics.filter(clinic=>clinic.clinicalSupervisorId==this.userId);
					this.clinicName=this.clinics[0].clinicName;
					if(this.clinicName!="")
					{

					}
				}
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
					
				}
					);
			else if(this.route.snapshot.paramMap.get('status')=='notInCourt') {
				this.dashboardService.selectAllLegalCasesNotInCourt().subscribe(
					data=> {
						this.cases=data;
							}
						);
			}

			
			else if(this.currentRole==Roles.SUPERVISOR)
			{
				this.dashboardService.getAllCases().subscribe(
					data=> {
						this.cases=data;
						this.cases=this.cases.filter(lCase=>lCase.clinicName==this.clinics[0].clinicName);
					}
						);
			}

			else if(this.currentRole==Roles.STUDENT)
			{
				this.dashboardService.getAllCasesAssignedToStudennt(this.userId).subscribe(
					data=>{
						this.cases=data;
					}
				)
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
		/*
		id!: number;
		dateAdded!: Date;
		subject!: string;
		status!: string;
		courtCaseId!: number;
		clinicName!: string;
		clientId!:number;
		type!:string
		*/
		this.addedCase.id=0;
		this.addedCase.dateAdded=new Date();;
		this.addedCase.status="חדש";
		if(this.currentRole==Roles.SUPERVISOR)
			this.addedCase.clinicName=this.clinics[0].clinicName;
		
		this.dashboardService.addNewCase(this.addedCase).subscribe(

		 )
	}

	validateFields():boolean
	{
		if(this.addedCase.id==0)
		{
			alert("מספר תיק חסר ")
			return false
		}
		if(this.currentRole==Roles.SUPERADMIN && 
			typeof this.addedCase.clinicName==undefined || this.addedCase.clinicName=='' ){
				alert("יש להוסיף שם קליניקה")
				return false
		}
		if(typeof this.addedCase.subject==undefined || this.addedCase.subject=='' ){
				alert("יש להגדיר נושא לתיק")
				return false
		}
		
		if(typeof this.addedCase.caseType==undefined || this.addedCase.caseType=='' ){
			alert("יש להגדיר את סוג התיק")
			return false
		}

		if(typeof this.addedCase.clientId==undefined || this.addedCase.clientId==0 ){
			alert("יש להוסף לקוח לתיק")
			return false
		}
		
		return true;
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
/*
		this.dashboardService.editCase(legalCase).subscribe(
			 
		 )
	*/
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

	
	createNotification(type:NotificationType)
	{
	  let n:NotificationtsToUsers=new NotificationtsToUsers();
	  n.dateTime=new Date();
	  n.sourceId=
		JSON.parse(
		  JSON.stringify(
			jwt_decode(localStorage.getItem("authenticationToken") + "")
		  )
		).sub
	  
		/*
		if(type==NotificationType.ADD)
		{
		  n.details=this.supervisorName+" הוסיף סטודנט חדש לקליניקה";
		}
		if(type==NotificationType.EDIT)
		{
		  n.details=this.supervisorName+" ערך פרטים של סטודנט";
		}
		if(type==NotificationType.DELETE)
		{
		  n.details=this.supervisorName+" מחק סטודנט מהקליניקה";
		}
		*/
	  this.dashboardService.addNotification(n).subscribe(
		data=>{
		  this.mapNotification(data[0]);
		  
		},
		err=>
		{
		  alert("notification was not added")
		}
	  )
	}
  
	mapNotification(notificationId:string)
	{
	  let ng:NotificationManager=new NotificationManager();
	  ng.unread=false;
	  ng.notificationId=notificationId;
	  /*
	  if(this.currentRole==Roles.SUPERADMIN)
	  {
		ng.receiverId=this.supervisorId;
		this.addNotificationToUser(ng)
  
	  }
	  */
	  /*
	  else{
		alert("the user is supervisor")
		this.dashboardService.getAllPersons().subscribe(
		  data=>{
			data.forEach(person=>{
			  if(person.role=="Super Admin")
			  {
				ng.receiverId=person.id;
			  }
  
			})
			this.addNotificationToUser(ng)
  
		  }
		)
		
	  }
	  */
  
	}
  
	addNotificationToUser(notificationManager:NotificationManager)
	{
	  this.dashboardService.mapNotificationToUser(notificationManager).subscribe(
		data=>{
		  alert("notification was mapped")
		},
		err=>
		{
		  alert("Error!!!")
		}
	  )
	}

	


}

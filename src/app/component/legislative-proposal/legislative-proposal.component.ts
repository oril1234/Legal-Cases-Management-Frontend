import { Component, ViewChild, OnInit } from '@angular/core';
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
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Client } from '../../_models/client'
import { Roles } from 'src/app/_models/roles.enum';
import { ClinicalSupervisor } from 'src/app/_models/clinical-supervisor';
import { NotificationType } from 'src/app/_models/notification-type.enum';
import { NotificationtsToUsers } from 'src/app/_models/notification';
import { NotificationManager } from 'src/app/_models/notification-manager';
import { Person } from 'src/app/_models/person';
import { LegislativeProposal } from 'src/app/_models/legislative-proposal';

@Component({
  selector: 'app-legislative-proposal',
  templateUrl: './legislative-proposal.component.html',
  styleUrls: ['./legislative-proposal.component.css']
})
export class LegislativeProposalComponent implements OnInit {

	admin=new Person()
	proposals: LegislativeProposal[];
	clinics: Clinic[];
	supervisors: ClinicalSupervisor[]
	currentSuperVisor: ClinicalSupervisor
	currentRole = parseInt(localStorage.getItem('Role') + "");
	closeResult = "";
	currentStatus = ""
	clinicName: string = ""
	currentClient: Client = new Client();
	newClient: Client = new Client()
	userId = parseInt(
		JSON.parse(
			JSON.stringify(
				jwt_decode(localStorage.getItem("authenticationToken") + "")
			)
		).sub);
	userFullName: string = ""
	userDetails:Person=new Person();
	clients: Client[] = []
	chosenClinic: Clinic = new Clinic()

	addedProposal: LegislativeProposal = new LegislativeProposal()
	edittedCase: LegalCase = new LegalCase()

	defaultCaseType: string = "פלילי"
	caseTypes: string[] = [`פלילי`, `שכר עבודה בסמכות רשם`, `הטרדה מאיימת וצו הגנה`, `ערעור ביטוח לאומי`,
		`האזנת סתר`, `עתירה לבג"ץ`, `ביצוע תביעה בהוצאה לפועל`, `ביטול קנס מנהלי`, `תביעה קטנה`,'ערעור מסים']


	constructor(private dashboardService: DashboardService, private modalService: NgbModal,private router:Router	)
	{

		this.getPersonDetails();
    	this.getAllClinics();
		if(this.currentRole==Roles.SUPERVISOR)
			this.getAdminDetails();
	

	
	}
	public ngOnInit(): void
	{
		this.router.routeReuseStrategy.shouldReuseRoute = () => false;

	}



	getPersonDetails()
	{
		this.dashboardService.getPersonById(this.userId).subscribe(
			data=>{
				this.userDetails=data;
			}
		)

		
	}

	getAdminDetails()
	{
		this.dashboardService.getAllPersons().subscribe(
			data=>{
				data=data.filter(person=>person.role=="Super Admin")
				this.admin=data[0];
			},
			err=>{
			}
		)
	}



	//Getting all the clinics for assigning new cases to specific clinic
	getAllClinics()
	{
		this.dashboardService.getAllClinic().subscribe(
			data =>
			{
				this.clinics = data;

				if(this.currentRole==Roles.SUPERVISOR)
				{
					this.clinics = this.clinics.filter(clinic => clinic.clinicalSupervisorId == this.userId);
					
				}
				this.chosenClinic=this.clinics[0];
				this.clinicName = this.clinics[0].clinicName;
        

				this.getAllProposals();
				
			}
		)

	}


	getAllProposals()
	{


			this.dashboardService.getAllProposal().subscribe(
				data =>
				{
					
					this.proposals = data;
					if (this.currentRole == Roles.SUPERVISOR)
						this.proposals = this.proposals.filter(lCase => lCase.clinicName == this.clinics[0].clinicName);
				},
			);


	}

	//Modal methodd
	open(content: string)
	{
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'dark-modal' }).result.then((result) =>
		{
			this.closeResult = `Closed with: ${result}`;
		}, (reason) =>
		{
			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

		});

	}

	openDeleteModal(firstName: string, lastName: string, id: string)
	{

	}
	private getDismissReason(reason: ModalDismissReasons): string
	{
		if (reason === ModalDismissReasons.ESC)
		{
			this.addedProposal = new LegislativeProposal()
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK)
		{
			this.addedProposal=new LegislativeProposal();
			return 'by clicking on a backdrop';
		} else
		{
			return `with: ${reason}`;
		}
	}


	//Invoked when adding new case
	onSave()
	{

		
		this.addedProposal.status = "חדש";
		if(this.currentRole==Roles.SUPERVISOR)
			this.addedProposal.clinicName = this.clinicName;
		else
			this.addedProposal.clinicName==this.chosenClinic.clinicName;	

		this.dashboardService.addNewProposal(this.addedProposal).subscribe(
			data =>
			{
				this.proposals.push(this.addedProposal);
				this.createNotification(NotificationType.ADD,this.addedProposal.id)
				this.addedProposal=new LegislativeProposal()
				
			},
			err=>{
				this.addedProposal=new LegislativeProposal()
				
			}

		)
		

	}

  /*
	validateFields(): boolean
	{
		if (this.addedProposal.id == 0)
		{
			alert("מספר תיק חסר ")
			return false
		}
		if (this.currentRole == Roles.SUPERADMIN &&
			typeof this.addedProposal.clinicName == undefined || this.addedProposal.clinicName == '')
		{
			alert("יש להוסיף שם קליניקה")
			return false
		}
		if (typeof this.addedProposal.subject == undefined || this.addedProposal.subject == '')
		{
			alert("יש להגדיר נושא לתיק")
			return false
		}

		if (typeof this.addedProposal.caseType == undefined || this.addedProposal.caseType == '')
		{
			alert("יש להגדיר את סוג התיק")
			return false
		}

		if (typeof this.addedProposal.clientId == undefined || this.addedProposal.clientId == 0)
		{
			alert("יש להוסף לקוח לתיק")
			return false
		}

		return true;
	}
  */

	//Invoked for deleting case
	onDelete(id: string)
	{
		this.dashboardService.deleteProposal(parseInt(id)).subscribe(
			data =>
			{
				this.proposals = this.proposals.filter(lCase => lCase.id != parseInt(id))
				this.createNotification(NotificationType.DELETE,parseInt(id));
			}

		);
	}


	//Invoked for updating a case
	onEdit(proposal: LegislativeProposal)
	{
		this.dashboardService.editProposal(proposal).subscribe(
			data =>
			{
				this.createNotification(NotificationType.EDIT,proposal.id)
					
			},
			err =>
			{
			}

		)
		

	}

	createNotification(type:NotificationType,caseId:number)
	{
		if(this.userDetails.id==this.admin.id)
			return;
		
		let n:NotificationtsToUsers=new NotificationtsToUsers();
	  	n.dateTime=new Date();
	  	n.sourceId=this.userId

		if(this.currentRole==Roles.SUPERVISOR)  
		{
			if(type==NotificationType.ADD)
			{
				n.details=this.userDetails.firstName+" "+this.userDetails.lastName+
				" הוסיף הצעת חקיקה חדשה בקליניקה שלו ";
			}
			else if(type==NotificationType.EDIT)
			{
				n.details=this.userDetails.firstName+" "+this.userDetails.lastName+
				" ערך את הצעת חקיקה מספר  "+caseId+" בקליניקה שלו";
			}
			else if(type==NotificationType.DELETE)
			{
				n.details=this.userDetails.firstName+" "+this.userDetails.lastName+
				" מחק את הצעת חקיקה מספר   "+caseId+" בקליניקה שלו";
			}
		}

		if(this.currentRole==Roles.SUPERADMIN)  
		{
			if(type==NotificationType.ADD)
			{
				n.details=this.userDetails.firstName+" "+this.userDetails.lastName+
				" הוסיף הצעת חקיקה חדשה בקליניקה שלך ";
			}
			else if(type==NotificationType.EDIT)
			{
				n.details=this.userDetails.firstName+" "+this.userDetails.lastName+
				" ערך את הצעת חקיקה מספר  "+caseId+" בקליניקה שלך";
			}
			else if(type==NotificationType.DELETE)
			{
				n.details=this.userDetails.firstName+" "+this.userDetails.lastName+
				" מחק את הצעת חקיקה מספר   "+caseId+" בקליניקה שלך";
			}
		}

	  this.dashboardService.addNotification(n).subscribe(
		data=>{
			this.mapNotification(data[0]);
			
		},
		err=>
		{
			
			
		}
	  )
	  
	}
  
	mapNotification(notificationId:string)
	{
	  let ng:NotificationManager=new NotificationManager();
	  ng.unread=false;
	  ng.notificationId=notificationId;
	  if(this.currentRole==Roles.SUPERVISOR)
	  	{
			  ng.receiverId=this.admin.id;
		}
	  else
		{
			ng.receiverId=this.chosenClinic.clinicalSupervisorId;
		}
	  this.dashboardService.mapNotificationToUser(ng).subscribe(
		data=>{
		},
		err=>
		{
		}
	  )
	 
	}

}

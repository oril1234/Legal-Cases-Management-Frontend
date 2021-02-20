import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Clinic } from 'src/app/_models/clinic';
import jwt_decode from "jwt-decode";
import {Router } from '@angular/router';
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
  templateUrl: './legislative-proposal.component.html'})
export class LegislativeProposalComponent implements OnInit {

	///Admin details
	admin=new Person()
	//All Legislative proposals
	proposals: LegislativeProposal[];

	//All clinics
	clinics: Clinic[];

	//All clinical supervisors
	supervisors: ClinicalSupervisor[]

	//A specific clinical supervisor
	currentSuperVisor: ClinicalSupervisor

	//Role of connected user
	currentRole = parseInt(localStorage.getItem('Role') + "");

	//Reason to close modal window
	closeResult = "";

	//Name of specific clinic
	clinicName: string = ""

	//Id of connected user
	userId = parseInt(
		JSON.parse(
			JSON.stringify(
				jwt_decode(localStorage.getItem("authenticationToken") + "")
			)
		).sub);

	//Connected user full name	
	userFullName: string = ""

	//All user details
	userDetails:Person=new Person();

	//A pecific clinic details
	chosenClinic: Clinic = new Clinic()

	//New legislative prposal to add
	addedProposal: LegislativeProposal = new LegislativeProposal()

	//Edited legislative proposal
	edittedProposal: LegislativeProposal = new LegislativeProposal()


	constructor(private httpService: HttpService, private modalService: NgbModal,private router:Router	)
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


	//Personal details of connected user
	getPersonDetails()
	{
		this.httpService.getPersonById(this.userId).subscribe(
			data=>{
				this.userDetails=data;
			}
		)

		
	}

	//Admin details
	getAdminDetails()
	{
		this.httpService.getAllPersons().subscribe(
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
		this.httpService.getAllClinic().subscribe(
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


	//Getting all legislative proposal
	getAllProposals()
	{


			this.httpService.getAllProposal().subscribe(
				data =>
				{
					
					this.proposals = data;
					if (this.currentRole == Roles.SUPERVISOR)
						this.proposals = this.proposals.filter(lCase => lCase.clinicName == this.clinics[0].clinicName);
				},
			);


	}

	//Open modal window for adding new legislative proposal
	openAddModal(content: string)
	{
		this.httpService.getLegalCaseGeneratedId().subscribe(
			data=>{
				this.addedProposal.id=data;
			}
		)
		
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'dark-modal' }).result.then((result) =>
		{
			this.closeResult = `Closed with: ${result}`;
		}, (reason) =>
		{
			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

		});

	}

	//Open modal window for editing legislative proposal
	openEditModal(content:string,proposal:LegislativeProposal)
	{
		this.edittedProposal=Object.create(proposal);
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'dark-modal' }).result.then((result) =>
		{
			this.closeResult = `Closed with: ${result}`;
		}, (reason) =>
		{
			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

		});
	}

	//Open modal window for deleting legislative proposal
	openDeleteModal(content:string)
	{
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'dark-modal' }).result.then((result) =>
		{
			this.closeResult = `Closed with: ${result}`;
		}, (reason) =>
		{
			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

		});
	}

	//Get the reason to close modal window
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


	//Invoked when adding new legislative proposal
	onAdd()
	{

		
		this.addedProposal.status = "חדש";
		this.addedProposal.clinicName = this.chosenClinic.clinicName;

		this.httpService.addNewProposal(this.addedProposal).subscribe(
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

	//Validate fields of new proposal
	validateNewProposal():boolean
	{
		return typeof this.addedProposal.subject!="undefined" && this.addedProposal.subject!=""
		&& typeof this.addedProposal.proposalType!="undefined" && this.addedProposal.proposalType!="";
	}

	validateEditProposal():boolean
	{
		return typeof this.edittedProposal.subject!="undefined" && this.edittedProposal.subject!=""
		&& typeof this.edittedProposal.proposalType!="undefined" && this.edittedProposal.proposalType!=""
		&& typeof this.edittedProposal.status!="undefined" && this.edittedProposal.status!="";
	}



	//Invoked for deleting case
	onDelete(id: string)
	{
		this.httpService.deleteProposal(parseInt(id)).subscribe(
			data =>
			{
				this.proposals = this.proposals.filter(lCase => lCase.id != parseInt(id))
				this.createNotification(NotificationType.DELETE,parseInt(id));
			}

		);
	}


	//Invoked for updating a case
	onEdit(index:number)
	{
		this.edittedProposal.id=this.edittedProposal.id;
		this.edittedProposal.clinicName=this.edittedProposal.clinicName;
		this.edittedProposal.proposalType=this.edittedProposal.proposalType
		this.edittedProposal.status=this.edittedProposal.status
		this.edittedProposal.subject=this.edittedProposal.subject
		
		this.httpService.editProposal(this.edittedProposal).subscribe(
			data =>
			{
				this.proposals[index]=Object.create(this.edittedProposal);
				this.createNotification(NotificationType.EDIT,this.edittedProposal.id)
					
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

	  this.httpService.addNotification(n).subscribe(
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
	  this.httpService.mapNotificationToUser(ng).subscribe(
		data=>{
		},
		err=>
		{
		}
	  )
	 
	}

}

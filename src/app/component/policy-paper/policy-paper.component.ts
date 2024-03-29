import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
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
import { PolicyPaper } from 'src/app/_models/policy-paper';

@Component({
  selector: 'app-policy-paper',
  templateUrl: './policy-paper.component.html'})
export class PolicyPaperComponent implements OnInit {

	admin=new Person()
	policyPapers: PolicyPaper[];
	clinics: Clinic[];
	supervisors: ClinicalSupervisor[]
	currentSuperVisor: ClinicalSupervisor
	currentRole = parseInt(localStorage.getItem('Role') + "");
	closeResult = "";
	currentStatus = ""
	clinicName: string = ""
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

	addedPolicyPaper: PolicyPaper = new PolicyPaper()
	edittedPaper: PolicyPaper = new PolicyPaper()



	constructor(private httpService: HttpService, private modalService: NgbModal,private router:Router	)
	{

	this.getPersonDetails();
    this.getAllClinics()
	if(this.currentRole==Roles.SUPERVISOR)
		this.getAdminDetails();
	
	}
	public ngOnInit(): void
	{
		this.router.routeReuseStrategy.shouldReuseRoute = () => false;

	}

	getPersonDetails()
	{
		this.httpService.getPersonById(this.userId).subscribe(
			data=>{
				this.userDetails=data;
			}
		)

		
	}

	
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
        
        

				this.getAllPolicyPapers();
				
			},
			err=>{
				
			}
		)

	}


	getAllPolicyPapers()
	{
			this.httpService.getAllPolicyPapers().subscribe(
				data =>
				{
					this.policyPapers = data;
					if(this.currentRole!=Roles.SUPERADMIN)
          this.policyPapers = this.policyPapers.filter(paper => paper.clinicName == this.clinics[0].clinicName);
				},
				err=>{
				}
			);

	}

	//Modal methodd
	openAddModal(content: string)
	{
		this.httpService.getLegalCaseGeneratedId().subscribe(
			data=>{
				this.addedPolicyPaper.id=data;
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

	openEditModal(content: string,policyPaper:PolicyPaper)
	{

		this.edittedPaper=Object.create(policyPaper);
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'dark-modal' }).result.then((result) =>
		{
			this.closeResult = `Closed with: ${result}`;
		}, (reason) =>
		{
			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

		});

	}

	//Validate fields of new policy paper
	validateNewPaper():boolean
	{
		return typeof this.addedPolicyPaper.subject!="undefined" && this.addedPolicyPaper.subject!=""
		&& typeof this.addedPolicyPaper.policyType!="undefined" && this.addedPolicyPaper.policyType!="";
	}

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
	private getDismissReason(reason: ModalDismissReasons): string
	{
		if (reason === ModalDismissReasons.ESC)
		{
			this.addedPolicyPaper = new PolicyPaper()
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK)
		{
			this.addedPolicyPaper=new PolicyPaper();
			return 'by clicking on a backdrop';
		} else
		{
			return `with: ${reason}`;
		}
	}


	//Invoked when adding new case
	onAdd()
	{

		this.addedPolicyPaper.status = "חדש";
		this.addedPolicyPaper.clinicName = this.chosenClinic.clinicName
		this.addedPolicyPaper.policyType=this.addedPolicyPaper.policyType;
		this.addedPolicyPaper.subject=this.addedPolicyPaper.subject;

		console.log(this.addedPolicyPaper)
		this.httpService.addNewPolicyPaper(this.addedPolicyPaper).subscribe(
			data =>
			{
				this.getAllPolicyPapers();
				this.createNotification(NotificationType.ADD,this.addedPolicyPaper.id)
				this.addedPolicyPaper=new PolicyPaper()
			},
			err=>{
				this.addedPolicyPaper=new PolicyPaper()
				
			}

		)

	}


	//Invoked for deleting case
	onDelete(id: number)
	{
		this.httpService.deletePolicyPaper(id).subscribe(
			data =>
			{
				this.policyPapers = this.policyPapers.filter(paper =>paper.id!=id)
				this.createNotification(NotificationType.DELETE,id)
			},
		);
	}


	//Invoked for updating a case
	onEdit(index:number)
	{
		this.httpService.editPolicyPaper(this.edittedPaper).subscribe(
			data =>
			{
				this.policyPapers[index]=Object.create(this.edittedPaper);
				this.createNotification(NotificationType.EDIT,this.edittedPaper.id)	
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
				" הוסיף נייר מדיניות חדש בקליניקה שלו";
			}
			else if(type==NotificationType.EDIT)
			{
				n.details=this.userDetails.firstName+" "+this.userDetails.lastName+
				" ערך את נייר מדיניות מספר  "+caseId+" בקליניקה שלו";
			}
			else if(type==NotificationType.DELETE)
			{
				n.details=this.userDetails.firstName+" "+this.userDetails.lastName+
				" מחק את נייר מדיניות מספר   "+caseId+" בקליניקה שלו";
			}
		}

		if(this.currentRole==Roles.SUPERADMIN)  
		{
			if(type==NotificationType.ADD)
			{
				n.details=this.userDetails.firstName+" "+this.userDetails.lastName+
				" הוסיף נייר מדיניות חדש בקליניקה שלך ";
			}
			else if(type==NotificationType.EDIT)
			{
				n.details=this.userDetails.firstName+" "+this.userDetails.lastName+
				" ערך את נייר מדיניות מספר  "+caseId+" בקליניקה שלך";
			}
			else if(type==NotificationType.DELETE)
			{
				n.details=this.userDetails.firstName+" "+this.userDetails.lastName+
				" מחק את נייר מדיניות מספר   "+caseId+" בקליניקה שלך";
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


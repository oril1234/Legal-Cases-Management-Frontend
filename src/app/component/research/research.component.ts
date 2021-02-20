import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Clinic } from 'src/app/_models/clinic';
import jwt_decode from "jwt-decode";
import {Router } from '@angular/router';
import { Roles } from 'src/app/_models/roles.enum';
import { ClinicalSupervisor } from 'src/app/_models/clinical-supervisor';
import { NotificationType } from 'src/app/_models/notification-type.enum';
import { NotificationtsToUsers } from 'src/app/_models/notification';
import { NotificationManager } from 'src/app/_models/notification-manager';
import { Person } from 'src/app/_models/person';
import { Research } from 'src/app/_models/research';

@Component({
	selector: 'app-research',
	templateUrl: './research.component.html'
})
export class ResearchComponent implements OnInit {

	admin=new Person()
	researches: Research[];
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
	chosenClinic: Clinic = new Clinic()

	addedResearch: Research = new Research()
	edittedResearch: Research = new Research()



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

				if(this.currentRole==Roles.STUDENT)
				{
					this.httpService.getStudentById(this.userId).subscribe(
						data1=>{
							this.clinics = this.clinics.filter(clinic => clinic.clinicalSupervisorId == data1.clinicalSupervisorId);
						}
					)
				}
				this.chosenClinic=this.clinics[0];
				this.clinicName = this.clinics[0].clinicName;
        
				

				this.getAllResearches();
				
			}
		)

	}


	getAllResearches()
	{
			this.httpService.getAllResearches().subscribe(
				data =>
				{
					
					this.researches = data;
					if(this.currentRole!=Roles.SUPERADMIN)
						this.researches = this.researches.filter(lCase => lCase.clinicName == this.clinics[0].clinicName);
					
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
				this.addedResearch.id=data;
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

	openEditModal(content:string,research:Research)
	{
		this.edittedResearch=Object.create(research);
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'dark-modal' }).result.then((result) =>
		{
			this.closeResult = `Closed with: ${result}`;
		}, (reason) =>
		{
			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

		});

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
			this.addedResearch = new Research()
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK)
		{
			this.addedResearch=new Research();
			return 'by clicking on a backdrop';
		} else
		{
			return `with: ${reason}`;
		}
	}


	//Invoked when adding new case
	onAdd()
	{

		this.addedResearch.status = "חדש";
		this.addedResearch.clinicName = this.chosenClinic.clinicName

		this.httpService.addNewResearch(this.addedResearch).subscribe(
			data =>
			{
				this.researches.push(this.addedResearch);
				this.createNotification(NotificationType.ADD,this.addedResearch.id)
				this.addedResearch=new Research()
			},
			err=>{
				this.addedResearch=new Research()
				
			}

		)

	}

	//Validate fields of new proposal
	validateNewResearch():boolean
	{
		return typeof this.addedResearch.subject!="undefined" && this.addedResearch.subject!=""
		&& typeof this.addedResearch.researchType!="undefined" && this.addedResearch.researchType!="";
	}

	validateEditResearch():boolean
	{
		return typeof this.edittedResearch.subject!="undefined" && this.edittedResearch.subject!=""
		&& typeof this.edittedResearch.researchType!="undefined" && this.edittedResearch.researchType!=""
		&& typeof this.edittedResearch.status!="undefined" && this.edittedResearch.status!="";
	}

	//Invoked for deleting case
	onDelete(id: number)
	{
		this.httpService.deleteResearch(id).subscribe(
			data =>
			{
				this.researches = this.researches.filter(lCase => lCase.id !=id)
				this.createNotification(NotificationType.DELETE,id)
			},
		);
	}


	//Invoked for updating a case
	onEdit(index:number)
	{
		
		this.edittedResearch.id=this.edittedResearch.id;
		this.edittedResearch.clinicName=this.edittedResearch.clinicName;
		this.edittedResearch.researchType=this.edittedResearch.researchType
		this.edittedResearch.status=this.edittedResearch.status
		this.edittedResearch.subject=this.edittedResearch.subject

		this.httpService.editResearch(this.edittedResearch).subscribe(
			data =>
			{
				this.researches[index]=Object.create(this.edittedResearch);
				this.createNotification(NotificationType.EDIT,this.edittedResearch.id)	
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
				" הוסיף מחקר חדש בקליניקה שלו";
			}
			else if(type==NotificationType.EDIT)
			{
				n.details=this.userDetails.firstName+" "+this.userDetails.lastName+
				" ערך את מחקר מספר  "+caseId+" בקליניקה שלו";
			}
			else if(type==NotificationType.DELETE)
			{
				n.details=this.userDetails.firstName+" "+this.userDetails.lastName+
				" מחק את מחקר מספר   "+caseId+" בקליניקה שלו";
			}
		}

		if(this.currentRole==Roles.SUPERADMIN)  
		{
			if(type==NotificationType.ADD)
			{
				n.details=this.userDetails.firstName+" "+this.userDetails.lastName+
				" הוסיף מחקר חדש בקליניקה שלך ";
			}
			else if(type==NotificationType.EDIT)
			{
				n.details=this.userDetails.firstName+" "+this.userDetails.lastName+
				" ערך את מחקר מספר  "+caseId+" בקליניקה שלך";
			}
			else if(type==NotificationType.DELETE)
			{
				n.details=this.userDetails.firstName+" "+this.userDetails.lastName+
				" מחק את מחקר מספר   "+caseId+" בקליניקה שלך";
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

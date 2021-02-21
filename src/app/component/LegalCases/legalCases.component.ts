import { Component,OnInit } from '@angular/core';
import { NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from 'src/app/http.service';
import { LegalCase } from 'src/app/_models/legal-case';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Clinic } from 'src/app/_models/clinic';
import jwt_decode from "jwt-decode";
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from '../../_models/client'
import { Roles } from 'src/app/_models/roles.enum';
import { ClinicalSupervisor } from 'src/app/_models/clinical-supervisor';
import { NotificationType } from 'src/app/_models/notification-type.enum';
import { NotificationtsToUsers } from 'src/app/_models/notification';
import { NotificationManager } from 'src/app/_models/notification-manager';
import { Person } from 'src/app/_models/person';
import { AssignedCase } from 'src/app/_models/assigned-case';
import { access } from 'fs';
@Component({
	selector: 'app-ngbd-buttons-radio',
	templateUrl: './legalCases.html',
	providers: [NgbCarouselConfig]
})
export class LegalCasesComponent implements OnInit
{
	//details of admin
	admin:Person=new Person()

	//Title of cases in this page
	title:string="פרטי תיקים בקליניקה";

	//Case details
	cases: LegalCase[];

	//Cases that were assigned to students
	assignedCases:AssignedCase[]=[]

	//All legal Clinics
	clinics: Clinic[];

	//A specific clinic
	chosenClinic: Clinic = new Clinic()

	//All Clinical supervisors
	supervisors: ClinicalSupervisor[]

	//Specific clinical supervisor
	currentSuperVisor: ClinicalSupervisor

	//Role of connected user
	currentRole = parseInt(localStorage.getItem('Role') + "");
	
	//A string representation of the reaseon to close o div modal 
	closeResult = "";

	//Status of displayed cases ( in court or not )
	currentStatus:string = ""

	//A specific clinic name
	clinicName: string = ""

	//A specific client details
	currentClient: Client = new Client();

	//A newly added client to system
	newClient: Client = new Client()

	//Id of connected user
	userId = parseInt(
		JSON.parse(
			JSON.stringify(
				jwt_decode(localStorage.getItem("authenticationToken") + "")
			)
		).sub);
	
	//Full name of connected user	
	userFullName: string = ""

	//Details of connected user
	userDetails: Person = new Person();

	//All clients details
	clients: Client[] = []

	//A specific client details to open a case for			
	chosenClient: Client = new Client()

	//A newly added case
	addedCase: LegalCase = new LegalCase()

	//A case to edit its details
	edittedCase: LegalCase = new LegalCase()

	//Default case type of new added case
	defaultCaseType: string = "פלילי"

	//All possible case types
	caseTypes: string[] = [`פלילי`, `שכר עבודה בסמכות רשם`, `הטרדה מאיימת וצו הגנה`, `ערעור ביטוח לאומי`,
		`האזנת סתר`, `עתירה לבג"ץ`, `ביצוע תביעה בהוצאה לפועל`, `ביטול קנס מנהלי`, `תביעה קטנה`, 'ערעור מסים',
	`יישוב סכסוך`]


	constructor(private httpService: HttpService, private modalService: NgbModal,
		private route: ActivatedRoute,
		private router: Router
	)
	{

		//This condition is true only if user is admin because only then there's additional data i url
		if (this.route.snapshot.paramMap.get('status'))
		{
			this.currentStatus = this.route.snapshot.paramMap.get('status') + "";
			this.title=this.currentStatus=="allInCourt"?"פרטי תיקים בבית משפט":"פרטי תיקים בטיפול הקליניקות";
		}
		this.addedCase.caseType=this.caseTypes[0];

		this.getPersonDetails();

		if (this.currentRole != Roles.STUDENT)
			{
				this.getAllClinics();
				this.getAllCaseseAssigned();
			}
		else
			this.getAllCases();
		this.getClients()
		if(this.currentRole==Roles.SUPERVISOR)
			this.getAdminDetails();

	}
	public ngOnInit(): void
	{
		this.router.routeReuseStrategy.shouldReuseRoute = () => false;

	}

	//Fetching details of connected user
	getPersonDetails()
	{
		this.httpService.getPersonById(this.userId).subscribe(
			data =>
			{
				this.userDetails = data;
			}
		)


		//Clinical supervisor's details are fetched if connected user is student
		if (this.currentRole == Roles.STUDENT)
		{
			this.httpService.getStudentsClinicalSupervisorDetails(this.userId).subscribe(
				data =>
				{
					this.currentSuperVisor = data;
					this.title="תיקים מוקצים"
				}
			)
		}


	}

	//Fetching all details of admin
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


	//Fetching all clients details
	getClients()
	{
		this.httpService.getAllClients().subscribe(
			data =>
			{
				this.clients = data;
				this.chosenClient = this.clients[0];
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
					this.clinics = this.clinics.filter(clinic => clinic.clinicalSupervisorId == this.userId);
				this.chosenClinic=this.clinics[0];	
				this.clinicName = this.chosenClinic.clinicName;

				this.getAllCases();

			}
		)

	}


	//Fetching legal cases details
	getAllCases()
	{

		//Fetching details of legal cases in court 
		if (this.route.snapshot.paramMap.get('status') == 'allInCourt')
			this.httpService.selectAllLegalCasesInCourt().subscribe(
				data =>
				{
					this.cases = data;

				}
			);

		//Fetching details of legal cases not in court, meaning handled by clinics	
		else if (this.route.snapshot.paramMap.get('status') == 'notInCourt')
		{
			this.httpService.selectAllLegalCasesNotInCourt().subscribe(
				data =>
				{
					this.cases = data;
				}
			);
		}


		//Fetching all legal cases in clinic of clinical supervisors if he's the connected user
		else if (this.currentRole == Roles.SUPERVISOR)
		{
			this.httpService.getAllCases().subscribe(
				data =>
				{
					this.cases = data;
					this.cases = this.cases.filter(lCase => lCase.clinicName == this.clinics[0].clinicName);
				}
			);
		}

		else if (this.currentRole == Roles.STUDENT)
		{
			this.httpService.getAllCasesAssignedToStudennt(this.userId).subscribe(
				data =>
				{
					this.cases = data;
					this.httpService.getAllAssignedCases().subscribe(
						response=>{
							this.assignedCases=response
							this.assignedCases=this.assignedCases.filter(aCase=>aCase.studentId==this.userId)
							
						}
					)
				}
			)
		}



	}

	//Fetching all assignments details of cases to students
	getAllCaseseAssigned()
	{
		this.httpService.getAllAssignedCases().subscribe(
			data=>{
				this.assignedCases=data;
				
			}
		)
	}

	showTaskByCase(lCase:LegalCase):string
	{
		let result=this.assignedCases.filter(aCase=>aCase.legalCaseId==lCase.id)[0];
		
		return result.taskDescription;
	}

	showDueDateByCase(lCase:LegalCase):string
	{
		let result=this.assignedCases.filter(aCase=>aCase.legalCaseId==lCase.id)[0];
		return result.dueDate+"";
	}


	


	//Method to open a modal window for adding new legal case 
	openAddCaseModal(content: string)
	{
		this.httpService.getLegalCaseGeneratedId().subscribe(
			data=>{
				this.addedCase.id=data;
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

	//Method to open a modal window for editing existing legal case 
	openEditCaseModal(content: string,legalCase:LegalCase)
	{
		this.edittedCase=Object.create(legalCase);
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'dark-modal' }).result.then((result) =>
		{
			this.closeResult = `Closed with: ${result}`;
		}, (reason) =>
		{
			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
	
		});
	
	}

	//Method to open a modal window for deleting a legal case
	openDeleteModal(content: string)
	{
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'dark-modal' }).result.then((result) =>
		{
			this.closeResult = `Closed with: ${result}`;
		}, (reason) =>
		{
			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

		});
	}

	//Method to open a modal window for displaying client details
	openClientDetailsModal(content:string)
	{
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'dark-modal' }).result.then((result) =>
		{
			this.closeResult = `Closed with: ${result}`;
		}, (reason) =>
		{
			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

		});
	}

	//Method to open a modal window for adding new client
	openAddClientModal(content:string)
	{
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'dark-modal' }).result.then((result) =>
		{
			this.closeResult = `Closed with: ${result}`;
		}, (reason) =>
		{
			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

		});
	}


	//Method to fetch the reason of closing a modal window
	private getDismissReason(reason: ModalDismissReasons): string
	{
		if (reason === ModalDismissReasons.ESC)
		{
			this.addedCase = new LegalCase();
			this.addedCase = new LegalCase()
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK)
		{
			this.addedCase = new LegalCase();
			return 'by clicking on a backdrop';
		} else
		{
			return `with: ${reason}`;
		}
	}



	//Invoked when adding new case
	onAdd()
	{

		this.addedCase.dateAdded = new Date();;
		this.addedCase.status = "ממתין להקצאה";
		this.addedCase.caseType = this.defaultCaseType;
		this.addedCase.clientId = this.chosenClient.id
		this.addedCase.clinicName = this.chosenClinic.clinicName
		this.addedCase.courtCaseId=0;

		this.httpService.addNewCase(this.addedCase).subscribe(
			data =>
			{
				this.cases.push(this.addedCase);
				this.addedCase = new LegalCase();
			},
			err =>
			{
				this.addedCase = new LegalCase();

			}

		)

	}


	//This method checks all fields of new legal case are valid, otherwise adding will not be possible
	validateAddedCaseFields():boolean
	{
	  let isValidated=typeof this.addedCase.id !== 'undefined' && this.addedCase.id>0;
	  isValidated=isValidated && typeof this.addedCase.subject !== 'undefined' && this.addedCase.subject!="";
	  isValidated=isValidated && typeof this.chosenClient !== 'undefined';
	  isValidated=isValidated && typeof this.chosenClinic !== 'undefined';

	  return isValidated;
	}

	//This method checks all fields of edited legal case are valid, otherwise editing will not be possible
	validateEdittedCaseFields():boolean
	{
	  let isValidated=typeof this.edittedCase.subject !== 'undefined' && this.edittedCase.subject!="";
	  isValidated=isValidated && typeof this.edittedCase.status !== 'undefined' && this.edittedCase.status!="";
	  isValidated=isValidated && typeof this.edittedCase.courtCaseId !== 'undefined' && this.edittedCase.courtCaseId+""!=""
	  && this.edittedCase.courtCaseId>=0;	

	  return isValidated;
	}


	//Invoked for deleting legal case
	onDelete(id: string)
	{
		this.httpService.deleteCase(parseInt(id)).subscribe(
			data =>
			{
				this.cases = this.cases.filter(lCase => lCase.id != parseInt(id))
			}

		);
	}


	//Invoked for updating a case
	onEdit(index:number)
	{
		this.edittedCase.caseType=this.edittedCase.caseType;
		this.edittedCase.clientId=this.edittedCase.clientId;
		this.edittedCase.clinicName=this.edittedCase.clinicName;
		this.edittedCase.courtCaseId=this.edittedCase.courtCaseId;
		this.edittedCase.dateAdded=this.edittedCase.dateAdded;
		this.edittedCase.id=this.edittedCase.id;
		this.edittedCase.status=this.edittedCase.status;
		this.edittedCase.subject=this.edittedCase.subject;
	

		this.httpService.editCase(this.edittedCase).subscribe(
			data =>
			{
				this.cases[index]=Object.create(this.edittedCase);
				if (this.currentRole == Roles.STUDENT)
					this.createNotification(NotificationType.EDIT, this.edittedCase.id)

			},
			err =>
			{
			}

		)
	}

	//Displaying details of a speific client
	showDetails(id: number)
	{
		this.httpService.getClientById(id).subscribe(
			data =>
			{
				this.currentClient = data;
			}
		)
	}


	createNotification(type: NotificationType, caseId: number)
	{

		let relevantCase:LegalCase=this.cases.filter(lCase=>lCase.id==caseId)[0];
		let relevantClinic:Clinic=this.clinics.filter(clinic=>clinic.clinicName==relevantCase.clinicName)[0];
		let relevantSupervisorId=relevantClinic.clinicalSupervisorId;
		
		this.createNotificationForStudnets(caseId);
		if(this.admin.id!=relevantSupervisorId && this.userId==this.admin.id)
		{
			this.createNotificationForSupervisorFromAdmin(type,caseId,relevantSupervisorId);
		}


	}

	/*
	If connected user is a admin, this method will be invoked to send notification to clinical supervisor
	of a clinic in which the admin made an action (Add/delete/edit legal case)
	*/ 
	createNotificationForSupervisorFromAdmin(type: NotificationType, caseId: number,supervisorId:number)
	{
		let n: NotificationtsToUsers = new NotificationtsToUsers();
		n.dateTime = new Date();
		n.sourceId = this.userId;

		if(type==NotificationType.EDIT)
		{
			n.details = this.userDetails.firstName + " " + this.userDetails.lastName +
			" ערך את פרטי התיק " + caseId + " בקליניקה שלך";
		}
		else if(type==NotificationType.ADD)
		{
			n.details = this.userDetails.firstName + " " + this.userDetails.lastName +
			" הוסיף את תיק מספר " + caseId + " לקליניקה שלך";
		}
		else
		{
			n.details = this.userDetails.firstName + " " + this.userDetails.lastName +
			" מחר את תיק מסםר " + caseId + " מהקליניקה שלך"
		}

		this.httpService.addNotification(n).subscribe(
			data=>{
				let notificationId:string=data[0];
				let ng: NotificationManager = new NotificationManager();
				ng.unread = false;
				ng.notificationId = notificationId;
				ng.receiverId = supervisorId;
				this.httpService.mapNotificationToUser(ng).subscribe(

				)
			}
		)	
	}

	//Notifying students for changes in cases they are assigned to made by clinical supervisor or admin
	createNotificationForStudnets(caseId: number)
	{
		let assignedCases=this.assignedCases.filter(aCase=>aCase.legalCaseId==caseId);
		if(assignedCases.length==0)
			return;
		let n: NotificationtsToUsers = new NotificationtsToUsers();
		n.dateTime = new Date();
		n.sourceId = this.userId;
		n.details = this.userDetails.firstName + " " + this.userDetails.lastName +
		" ערך את פרטי התיק " + caseId + " המוקצה עבורך";	
		
		this.httpService.addNotification(n).subscribe(
			data=>{
				let notificationId:string=data[0];
				assignedCases.forEach(aCase=>{
			
					if(aCase.studentId!=this.userId)
					{
						let ng: NotificationManager = new NotificationManager();
						ng.unread = false;
						ng.notificationId = notificationId;
						ng.receiverId = aCase.studentId;
						this.httpService.mapNotificationToUser(ng).subscribe(
							data =>
							{
							},
	
						)
					}


				})

			}
		)	



	}

	//Adding new client tyo system
	addNewClient()
	{
		this.httpService.addNewClient(this.newClient).subscribe(
			data =>
			{
				this.clients.push(this.newClient);
			}
		)
	}




}

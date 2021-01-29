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
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from '../../_models/client'
import { Roles } from 'src/app/_models/roles.enum';
import { ClinicalSupervisor } from 'src/app/_models/clinical-supervisor';
import { NotificationType } from 'src/app/_models/notification-type.enum';
import { NotificationtsToUsers } from 'src/app/_models/notification';
import { NotificationManager } from 'src/app/_models/notification-manager';
import { Person } from 'src/app/_models/person';
import { AssignedCase } from 'src/app/_models/assigned-case';






@Component({
	selector: 'app-ngbd-buttons-radio',
	templateUrl: './legalCases.html',
	providers: [NgbCarouselConfig]
})
export class LegalCasesComponent implements OnInit
{
	admin:Person=new Person()
	title:string="פרטי תיקים בקליניקה";
	cases: LegalCase[];
	assignedCases:AssignedCase[]=[]
	clinics: Clinic[];
	chosenClinic: Clinic = new Clinic()
	supervisors: ClinicalSupervisor[]
	currentSuperVisor: ClinicalSupervisor
	currentRole = parseInt(localStorage.getItem('Role') + "");
	closeResult = "";
	currentStatus:string = ""
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
	userDetails: Person = new Person();
	clients: Client[] = []
	chosenClient: Client = new Client()

	addedCase: LegalCase = new LegalCase()
	edittedCase: LegalCase = new LegalCase()

	defaultCaseType: string = "פלילי"
	caseTypes: string[] = [`פלילי`, `שכר עבודה בסמכות רשם`, `הטרדה מאיימת וצו הגנה`, `ערעור ביטוח לאומי`,
		`האזנת סתר`, `עתירה לבג"ץ`, `ביצוע תביעה בהוצאה לפועל`, `ביטול קנס מנהלי`, `תביעה קטנה`, 'ערעור מסים',
	`יישוב סכסוך`]


	constructor(private dashboardService: DashboardService, private modalService: NgbModal,
		private route: ActivatedRoute,
		private router: Router
	)
	{

		
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

	getPersonDetails()
	{
		this.dashboardService.getPersonById(this.userId).subscribe(
			data =>
			{
				this.userDetails = data;
			}
		)


		if (this.currentRole == Roles.STUDENT)
		{
			this.dashboardService.getStudentsClinicalSupervisorDetails(this.userId).subscribe(
				data =>
				{
					this.currentSuperVisor = data;
				}
			)
		}


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


	getClients()
	{
		this.dashboardService.getAllClients().subscribe(
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
		
		this.dashboardService.getAllClinic().subscribe(
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


	getAllCases()
	{

		if (this.route.snapshot.paramMap.get('status') == 'allInCourt')
			this.dashboardService.selectAllLegalCasesInCourt().subscribe(
				data =>
				{
					this.cases = data;

				}
			);
		else if (this.route.snapshot.paramMap.get('status') == 'notInCourt')
		{
			this.dashboardService.selectAllLegalCasesNotInCourt().subscribe(
				data =>
				{
					this.cases = data;
				}
			);
		}


		else if (this.currentRole == Roles.SUPERVISOR)
		{
			this.dashboardService.getAllCases().subscribe(
				data =>
				{
					this.cases = data;
					this.cases = this.cases.filter(lCase => lCase.clinicName == this.clinics[0].clinicName);
				}
			);
		}

		else if (this.currentRole == Roles.STUDENT)
		{
			this.dashboardService.getAllCasesAssignedToStudennt(this.userId).subscribe(
				data =>
				{
					this.cases = data;
				}
			)
		}


	}

	getAllCaseseAssigned()
	{
		this.dashboardService.getAllAssignedCases().subscribe(
			data=>{
				this.assignedCases=data;
				
			}
		)
	}

	


	//Modal methodd
	openAddCaseModal(content: string)
	{
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'dark-modal' }).result.then((result) =>
		{
			this.closeResult = `Closed with: ${result}`;
		}, (reason) =>
		{
			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

		});

	}

		//Modal methodd
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
	onSave()
	{

		this.addedCase.dateAdded = new Date();;
		this.addedCase.status = "חדש";
		this.addedCase.caseType = this.defaultCaseType;
		this.addedCase.clientId = this.chosenClient.id
		this.addedCase.clinicName = this.chosenClinic.clinicName

		this.dashboardService.addNewCase(this.addedCase).subscribe(
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


	validateAddedCaseFields():boolean
	{
	  let isValidated=typeof this.addedCase.id !== 'undefined' && this.addedCase.id>0;
	  isValidated=isValidated && typeof this.addedCase.subject !== 'undefined' && this.addedCase.subject!="";
	  isValidated=isValidated && typeof this.chosenClient !== 'undefined';
	  isValidated=isValidated && typeof this.chosenClinic !== 'undefined';

	  return isValidated;
	}

	validateEdittedCaseFields():boolean
	{
	  let isValidated=typeof this.edittedCase.subject !== 'undefined' && this.edittedCase.subject!="";
	  isValidated=isValidated && typeof this.edittedCase.status !== 'undefined' && this.edittedCase.status!="";
	  isValidated=isValidated && typeof this.edittedCase.courtCaseId !== 'undefined' && this.edittedCase.courtCaseId+""!=""
	  && this.edittedCase.courtCaseId>=0;	

	  return isValidated;
	}


	//Invoked for deleting case
	onDelete(id: string)
	{
		this.dashboardService.deleteCase(parseInt(id)).subscribe(
			data =>
			{
				this.cases = this.cases.filter(lCase => lCase.id != parseInt(id))
			}

		);
	}


	//Invoked for updating a case
	onEdit(lcase: LegalCase)
	{


		this.dashboardService.editCase(lcase).subscribe(
			data =>
			{
				if (this.currentRole == Roles.STUDENT)
					this.createNotification(NotificationType.EDIT, lcase.id)

			},
			err =>
			{
			}

		)


	}

	showDetails(id: number)
	{
		this.dashboardService.getClientById(id).subscribe(
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

		this.dashboardService.addNotification(n).subscribe(
			data=>{
				let notificationId:string=data[0];
				let ng: NotificationManager = new NotificationManager();
				ng.unread = false;
				ng.notificationId = notificationId;
				ng.receiverId = supervisorId;
				this.dashboardService.mapNotificationToUser(ng).subscribe(

				)
			}
		)	
	}

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
		
		this.dashboardService.addNotification(n).subscribe(
			data=>{
				let notificationId:string=data[0];
				assignedCases.forEach(aCase=>{
			
					if(aCase.studentId!=this.userId)
					{
						let ng: NotificationManager = new NotificationManager();
						ng.unread = false;
						ng.notificationId = notificationId;
						ng.receiverId = aCase.studentId;
						this.dashboardService.mapNotificationToUser(ng).subscribe(
							data =>
							{
							},
	
						)
					}


				})

			}
		)	



	}




	addNewClient()
	{
		this.dashboardService.addNewClient(this.newClient).subscribe(
			data =>
			{
				this.clients.push(this.newClient);
			}
		)
	}




}

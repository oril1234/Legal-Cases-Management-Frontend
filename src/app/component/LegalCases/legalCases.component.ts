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






@Component({
	selector: 'app-ngbd-buttons-radio',
	templateUrl: './legalCases.html',
	providers: [NgbCarouselConfig]
})
export class LegalCasesComponent implements OnInit
{
	cases: LegalCase[];
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
	chosenClient: Client = new Client()

	addedCase: LegalCase = new LegalCase()
	edittedCase: LegalCase = new LegalCase()

	defaultCaseType: string = "פלילי"
	caseTypes: string[] = [`פלילי`, `שכר עבודה בסמכות רשם`, `הטרדה מאיימת וצו הגנה`, `ערעור ביטוח לאומי`,
		`האזנת סתר`, `עתירה לבג"ץ`, `ביצוע תביעה בהוצאה לפועל`, `ביטול קנס מנהלי`, `תביעה קטנה`]


	constructor(private dashboardService: DashboardService, private modalService: NgbModal,
		private route: ActivatedRoute,
		private router: Router
	)
	{

		if (this.route.snapshot.paramMap.get('status'))
		{
			this.currentStatus = this.route.snapshot.paramMap.get('') + "";
		}

		this.getPersonDetails();

		if(this.currentRole!=Roles.STUDENT)
			this.getAllClinics();
		else	
			this.getAllCasesAssignedToStudent();
		this.getClients()

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

		
		if(this.currentRole==Roles.STUDENT)
		{
			this.dashboardService.getStudentsClinicalSupervisorDetails(this.userId).subscribe(
				data=>{
					this.currentSuperVisor=data;
				}
			)
		}
		
		
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

				this.clinics = this.clinics.filter(clinic => clinic.clinicalSupervisorId == this.userId);
				this.clinicName = this.clinics[0].clinicName;


				if (this.currentRole != Roles.STUDENT)
					this.getAllCases();
				else
					this.getAllCasesAssignedToStudent();
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

	getAllCasesAssignedToStudent()
	{
		this.dashboardService.getAllCasesAssignedToStudennt(this.userId).subscribe(
			data =>
			{
				this.cases = data;
			}
		)

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
			this.addedCase = new LegalCase()
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK)
		{

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
		this.addedCase.clinicName = this.clinicName

		this.dashboardService.addNewCase(this.addedCase).subscribe(
			data =>
			{
				this.cases.push(this.addedCase);
			}

		)

	}

	validateFields(): boolean
	{
		if (this.addedCase.id == 0)
		{
			alert("מספר תיק חסר ")
			return false
		}
		if (this.currentRole == Roles.SUPERADMIN &&
			typeof this.addedCase.clinicName == undefined || this.addedCase.clinicName == '')
		{
			alert("יש להוסיף שם קליניקה")
			return false
		}
		if (typeof this.addedCase.subject == undefined || this.addedCase.subject == '')
		{
			alert("יש להגדיר נושא לתיק")
			return false
		}

		if (typeof this.addedCase.caseType == undefined || this.addedCase.caseType == '')
		{
			alert("יש להגדיר את סוג התיק")
			return false
		}

		if (typeof this.addedCase.clientId == undefined || this.addedCase.clientId == 0)
		{
			alert("יש להוסף לקוח לתיק")
			return false
		}

		return true;
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
				alert("עריכה תיק בוצעה בהצלחה")
				
				
				if(this.currentRole==Roles.STUDENT)
					this.createNotification(NotificationType.EDIT,lcase.id)
					
					
			},
			err =>
			{
				alert("עריכת תיק לא בוצעה בהצלחה")
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


	createNotification(type:NotificationType,caseId:number)
	{
		
		
		let n:NotificationtsToUsers=new NotificationtsToUsers();
	  	n.dateTime=new Date();
	  	n.sourceId=this.userId
		n.details=this.userDetails.firstName+" "+this.userDetails.lastname+
		" ערך את פרטי התיק "+caseId+" בקליניקה שלך"  


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
	  ng.receiverId=this.currentSuperVisor.id
	  this.dashboardService.mapNotificationToUser(ng).subscribe(
		data=>{
			alert("התראה נוספה בהצלחה")
		},
		err=>
		{
			alert("NO!!!!")
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

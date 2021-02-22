import { Component,OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { LegalCase } from 'src/app/_models/legal-case';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Clinic } from 'src/app/_models/clinic';
import jwt_decode from "jwt-decode";
import { Router } from '@angular/router';
import { Roles } from 'src/app/_models/roles.enum';
import { ClinicalSupervisor } from 'src/app/_models/clinical-supervisor';
import { NotificationType } from 'src/app/_models/notification-type.enum';
import { NotificationtsToUsers } from 'src/app/_models/notification';
import { NotificationManager } from 'src/app/_models/notification-manager';
import {CaseAssignedSupervisorsList} from 'src/app/_models/case-assigned-supervisors-list';
import {AssignedCase} from 'src/app/_models/assigned-case';
import { Student } from 'src/app/_models/student';
import { Person } from 'src/app/_models/person';
@Component({
  selector: 'app-assigned-case',
  templateUrl: './assigned-case.component.html'})

/**
 * A component of cases assifnment to students by clinical supervisors 
 */
export class AssignedCaseComponent implements OnInit {

	//Admin details
	admin:Person=new Person()
	
	//All Clinics
	clinics:Clinic[]=[];

	//clinic in which case will be assigned to student
	chosenClinic:Clinic=new Clinic()
	
	//All Cases
	cases:LegalCase[]

	//Supervisor of chosen clinic in which a legal case will be assigned to student
	currentSuperVisor:ClinicalSupervisor=new ClinicalSupervisor()

	//Role of current user
	currentRole=parseInt(localStorage.getItem('Role')+"");

	//Reson to close modal div
    closeResult="";

	//Id of current user
	userId = parseInt(
		JSON.parse(
		  JSON.stringify(
			jwt_decode(localStorage.getItem("authenticationToken") + "")
		  )
		).sub);

  //All students			
  students:Student[]=[]

  //All supervisors 
  supervisors:ClinicalSupervisor[]=[]
  
  //Details of all cases assignments by supervisor of chosen clinic
  caseAssignedBySupervisor:CaseAssignedSupervisorsList[]=[]

  //Details of all cases assignments by all supervisors
  caseAssignedByAllSupervisors:CaseAssignedSupervisorsList[]=[]

  //Studnet to which a case is assigned
  chosenStudent:Student=new Student()

  //A case assigned to student
  chosenCase:LegalCase=new LegalCase()

  //A task in an assigned case for student
  taskDescription:string="";

  //Last date for tas completion in an assigned case
  dueDate:Date=new Date();

  
constructor(private httpService: HttpService,private modalService: NgbModal,
 private router: Router)
{

	this.getAdminDetails();
	if(this.currentRole==Roles.SUPERVISOR)
	{
		this.getAllAssignedCasesBySupervisor()
		this.getAllCaseseDetails()
		this.getStudentsInClinic()
		this.getSupervisorsDetails();
	}
	else if(this.currentRole==Roles.SUPERADMIN)
	{
		this.getAllAssignedCasesBySupervisorForAdmin();
	}
	else{
		this.getStudentDetails()
	}	

}
public ngOnInit(): void 
{
	this.router.routeReuseStrategy.shouldReuseRoute = () => false;
}


//Fetching details of admin
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

//Fetching details of students with cases assigned to them
getStudentDetails()
{
	this.httpService.getStudentById(this.userId).subscribe(
		data=>{
			this.httpService.getAllAssignedCasesBySupervisor(data.clinicalSupervisorId).subscribe(
				data1=>{
					data1=data1.filter(lCase=>lCase.studentName==data.firstName+" "+data.lastName);
					this.caseAssignedBySupervisor=data1;
				}
			)
		}
	)
}

//Fetching details of specific clinical supervisor
getSupervisorsDetails()
{
	  this.httpService.getClinicalSupervisorById(this.userId).subscribe(
		data=>{
			this.currentSuperVisor=data;
		}
	  )
}

//Fetching details of all legal cases that are assigned to students
getAllAssignedCasesBySupervisorForAdmin()
{
	this.httpService.getAllSupervisors().subscribe(
		data=>{
			this.supervisors=data;
			this.currentSuperVisor=this.supervisors[0];

			this.httpService.getAllAssignedCasesBySupervisor(this.currentSuperVisor.id).subscribe(
				data=>{
				  this.caseAssignedBySupervisor=data;
				  this.getCasesDetailsForAdmin();
				},
				err=>{
					
				}
			  )
		
		}
	)
}

//Fetching details of all legal cases that are assigned to students for the use of admin
getCasesDetailsForAdmin()
{
	this.httpService.getAllClinic().subscribe(
		data=>{
			
			this.clinics=data;
			this.chosenClinic=this.clinics.filter(clinic=>clinic.clinicalSupervisorId==this.currentSuperVisor.id)[0];
			let clinicName=this.chosenClinic.clinicName;

			this.httpService.getAllCases().subscribe(
				data1=>{
					this.cases=data1.filter(lCase=>lCase.clinicName==clinicName);
					this.chosenCase=this.cases[0];
					this.getStudentsInClinicForAdmin();
					
				}
			)
		}
	)
}

//Fetching details of all legal cases that are assigned to students by clinical supervisor
getAllAssignedCasesBySupervisor()
{
		this.httpService.getAllAssignedCasesBySupervisor(this.userId).subscribe(
			data=>{
			  this.caseAssignedBySupervisor=data;
			},
			err=>{
				
			}
		  )


}

//Method for the use of a student
getAllAssignedCasesBySupervisorForStudent()
{
		this.httpService.getAllAssignedCasesBySupervisor(this.userId).subscribe(
			data=>{
			  this.caseAssignedBySupervisor=data;
			},
			err=>{
				
			}
		  )


}


//Fetching details of all legal cases
getAllCaseseDetails()
{
	  this.httpService.getAllClinic().subscribe(
		  data=>{
			  data=data.filter(clinic=>clinic.clinicalSupervisorId==this.userId);
			  let clinicName=data[0].clinicName;
			  
			  this.httpService.getAllCases().subscribe(
				  data1=>{
					  this.cases=data1.filter(lCase=>lCase.clinicName==clinicName);
					  this.chosenCase=this.cases[0];
					  
				  }
			  )
		  }
	  )
}

//Fetching details of students in clinic
getStudentsInClinic()
{
	  this.httpService.getAllStudents().subscribe(
		  data=>{
			  this.students=data.filter(student=>student.clinicalSupervisorId==this.userId);
			  this.chosenStudent=this.students[0];

		  }
	  )
}

//Fetching details of students in clinic for the use of admin
getStudentsInClinicForAdmin()
{
	  this.httpService.getAllStudents().subscribe(
		  data=>{
			  this.students=data.filter(student=>student.clinicalSupervisorId==this.currentSuperVisor.id);
			  this.chosenStudent=this.students[0];

		  }
	  )
}

//Choosing a clinic to display cases assignments to students
changeClinic()
{
	this.currentSuperVisor=this.supervisors.filter(supervisor=>supervisor.id==this.chosenClinic.clinicalSupervisorId)[0];

	this.httpService.getAllAssignedCasesBySupervisor(this.currentSuperVisor.id).subscribe(
		data=>{
		
		  this.caseAssignedBySupervisor=data;
		  this.getCasesDetailsForAdmin();
		},
		err=>{
			
		}
	  )
}

  
//Modal method
open(content:string) 
{
	 this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'dark-modal'}).result.then((result) => {
	 this.closeResult = `Closed with: ${result}`;
	 }, (reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
	
			});
			
}

//The reasin for closing a modal window
private getDismissReason(reason: ModalDismissReasons): string 
{
	if (reason === ModalDismissReasons.ESC) {
		return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return  `with: ${reason}`;
		}
		}

//Confirm new assignment of a legal case to student		
onAdd()
{
	const assigned=new AssignedCase();
			assigned.dateAssigned=new Date()
			assigned.legalCaseId=this.chosenCase.id
			assigned.studentId=this.chosenStudent.id;
			assigned.dueDate=this.dueDate>new Date()?this.dueDate:new Date();
			assigned.taskDescription=this.taskDescription;
			

			this.httpService.addNewCaseAssignment(assigned).subscribe(
				data=>{
					this.httpService.getCaseById(assigned.legalCaseId).subscribe(
						data1=>{
							let newItem:CaseAssignedSupervisorsList=new CaseAssignedSupervisorsList()
							newItem.dateAssigned=new Date();
							newItem.id=assigned.legalCaseId;
							newItem.status="בטיפול סטודנט";
							data1.status="בטיפול סטודנט";
							newItem.subject=data1.subject;
							newItem.taskDescription=assigned.taskDescription;
							newItem.dueDate=assigned.dueDate
							let student:Student=this.students.filter(aStudent=>aStudent.id==assigned.studentId)[0];
							newItem.studentName=student.firstName+" "+student.lastName;
							this.caseAssignedBySupervisor.push(newItem);
							this.resetFields();
							this.httpService.editCase(data1)
						}
					)
					this.createNotification(NotificationType.ADD,assigned.studentId,assigned.legalCaseId)
				},
				err=>{
				}
			)
	
}


//Making sure task description in an assignment of a legal case to a student is not empty
validateTaskDescription():boolean
{
	return typeof this.taskDescription!="undefined" && this.taskDescription!="";
}


resetFields()
{
	this.dueDate=new Date();
	this.taskDescription="";
}

onAssignCancel(caseId:number,studentName:string)
{
			
			let studentId:number=0;
			this.students.forEach(student=>{
				if(student.firstName+" "+student.lastName==studentName)
				{
					studentId=student.id;
				}
			})
			

			
			this.httpService.deleteCaseAssignmentByStudentIdAndCase(studentId,caseId).subscribe(
				data=>{
					this.createNotification(NotificationType.DELETE,studentId,caseId)
					this.caseAssignedBySupervisor=this.caseAssignedBySupervisor.filter(item=>(item.id!=caseId 
						|| item.studentName!=studentName))
				},
				err=>{
				}
			)

			
}
createNotification(type:NotificationType,studentId:number,caseId:number)
{
	let student=this.students.filter(student=>student.id==studentId)[0];
	let studentFullName=student.firstName+" "+student.lastName;
	let studentNotification:NotificationtsToUsers=new NotificationtsToUsers();
	studentNotification.dateTime=new Date();
	studentNotification.sourceId=this.userId;

	let supervisorNotification:NotificationtsToUsers=new NotificationtsToUsers();
	supervisorNotification.dateTime=new Date();
	supervisorNotification.sourceId=this.userId

		  
	if(type==NotificationType.ADD)
	{
		if(this.currentRole==Roles.SUPERADMIN && this.currentSuperVisor.id!=this.admin.id )
		{
			studentNotification.details="מנהל הקליניקות, "
			+this.admin.firstName+' '+
			this.admin.lastName+
			" הקצה עבורך את תיק מספר "+
			caseId;
			supervisorNotification.details=", "
			+this.admin.firstName+' '+
			this.admin.lastName+
			" הקצה את תיק מספר "+
			caseId+
			" עבור הסטודנט "+
			studentFullName
			+
			" בקליניקה שלך.";
		}
		else if(this.currentRole==Roles.SUPERVISOR || this.currentSuperVisor.id==this.admin.id)
		{
			studentNotification.details="המנחה שלך, "
			+this.currentSuperVisor.firstName+' '+
			this.currentSuperVisor.lastName+
			" הקצה עבורך את תיק מספר "+
			caseId;
		}

    }

	if(type==NotificationType.DELETE)
	{
		if(this.currentRole==Roles.SUPERADMIN && this.currentSuperVisor.id!=this.admin.id )
		{
			studentNotification.details="מנהל הקליניקות, "
			+this.admin.firstName+' '+
			this.admin.lastName+
			" ביטל את הקצאת תיק מספר "+
			caseId+
			" שהיה מוקצה עבורך";
			supervisorNotification.details=", "
			+this.admin.firstName+' '+
			this.admin.lastName+
			" ביטל את הקצאת תיק מספר "+
			caseId+
			" עבור הסטודנט "+
			studentFullName
			+
			" בקליניקה שלך.";
		}
		else if(this.currentRole==Roles.SUPERVISOR || this.currentSuperVisor.id==this.admin.id)
		{
			studentNotification.details="המנחה שלך, "+this.currentSuperVisor.firstName+' '+
			this.currentSuperVisor.lastName+" ביטל את ההקצאה שלך לתיק מספר "+caseId;
		}

		
	}
	this.httpService.addNotification(studentNotification).subscribe(
	data=>{
			this.mapNotification(data[0],studentId);
			  
		 },
	err=>
		{
		}
		  
	)

	if(this.currentRole==Roles.SUPERADMIN)
	{
		this.httpService.addNotification(supervisorNotification).subscribe(
			data=>{
					this.mapNotification(data[0],this.currentSuperVisor.id);
					  
				 },
			err=>
				{
				}
				  
			)
	}
}


	//Sending notification to users
	mapNotification(notificationId:string,receiverId:number)
	{
		let ng:NotificationManager=new NotificationManager();
		ng.unread=false;
		ng.notificationId=notificationId;
		ng.receiverId=receiverId
		this.httpService.mapNotificationToUser(ng).subscribe(
		data=>
		{
		},
		err=>
		{
		}
			
		)
		 
	}

}

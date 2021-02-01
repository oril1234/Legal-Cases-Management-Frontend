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
  templateUrl: './assigned-case.component.html',
  styleUrls: ['./assigned-case.component.css']
})
export class AssignedCaseComponent implements OnInit {

	admin:Person=new Person()
	clinics:Clinic[]=[];
	chosenClinic:Clinic=new Clinic()
	cases:LegalCase[]
	currentSuperVisor:ClinicalSupervisor=new ClinicalSupervisor()
	currentRole=parseInt(localStorage.getItem('Role')+"");
    closeResult="";
	userId = parseInt(
		JSON.parse(
		  JSON.stringify(
			jwt_decode(localStorage.getItem("authenticationToken") + "")
		  )
		).sub);
  students:Student[]=[]
  supervisors:ClinicalSupervisor[]=[]	
  caseAssignedBySupervisor:CaseAssignedSupervisorsList[]=[]
  caseAssignedByAllSupervisors:CaseAssignedSupervisorsList[]=[]
  chosenStudent:Student=new Student()
  chosenCase:LegalCase=new LegalCase()

  studentToCancelAssignment:Student=new Student()
  assignmentToCancel:LegalCase=new LegalCase()			

constructor(private dashboardService: DashboardService,private modalService: NgbModal,
 private route:ActivatedRoute,private router: Router)
{

	this.getAdminDetails();
	if(this.currentRole==Roles.SUPERVISOR)
	{
		this.getAllAssignedCasesBySupervisor()
		this.getAllCaseseDetails()
		this.getStudentsInClinic()
		this.getSupervisorsDetails();
	}
	else
	{
		this.getAllAssignedCasesBySupervisorForAdmin();
	}	

}
public ngOnInit(): void 
{
	this.router.routeReuseStrategy.shouldReuseRoute = () => false;
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

getSupervisorsDetails()
{
	  this.dashboardService.getClinicalSupervisorById(this.userId).subscribe(
		data=>{
			this.currentSuperVisor=data;
		}
	  )
}

getAllAssignedCasesBySupervisorForAdmin()
{
	this.dashboardService.getAllSupervisors().subscribe(
		data=>{
			this.supervisors=data;
			this.currentSuperVisor=this.supervisors[0];

			this.dashboardService.getAllAssignedCasesBySupervisor(this.currentSuperVisor.id).subscribe(
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

getCasesDetailsForAdmin()
{
	this.dashboardService.getAllClinic().subscribe(
		data=>{
			
			this.clinics=data;
			this.chosenClinic=this.clinics.filter(clinic=>clinic.clinicalSupervisorId==this.currentSuperVisor.id)[0];
			let clinicName=this.chosenClinic.clinicName;

			this.dashboardService.getAllCases().subscribe(
				data1=>{
					this.cases=data1.filter(lCase=>lCase.clinicName==clinicName);
					this.chosenCase=this.cases[0];
					this.getStudentsInClinicForAdmin();
					
				}
			)
		}
	)
}


getAllAssignedCasesBySupervisor()
{
		this.dashboardService.getAllAssignedCasesBySupervisor(this.userId).subscribe(
			data=>{
			  this.caseAssignedBySupervisor=data;
			},
			err=>{
				
			}
		  )


}
  
getAllCaseseDetails()
{
	  this.dashboardService.getAllClinic().subscribe(
		  data=>{
			  data=data.filter(clinic=>clinic.clinicalSupervisorId==this.userId);
			  let clinicName=data[0].clinicName;
			  
			  this.dashboardService.getAllCases().subscribe(
				  data1=>{
					  this.cases=data1.filter(lCase=>lCase.clinicName==clinicName);
					  this.chosenCase=this.cases[0];
					  
				  }
			  )
		  }
	  )
}

getStudentsInClinic()
{
	  this.dashboardService.getAllStudents().subscribe(
		  data=>{
			  this.students=data.filter(student=>student.clinicalSupervisorId==this.userId);
			  this.chosenStudent=this.students[0];

		  }
	  )
}

getStudentsInClinicForAdmin()
{
	  this.dashboardService.getAllStudents().subscribe(
		  data=>{
			  this.students=data.filter(student=>student.clinicalSupervisorId==this.currentSuperVisor.id);
			  this.chosenStudent=this.students[0];

		  }
	  )
}

changeClinic()
{
	this.currentSuperVisor=this.supervisors.filter(supervisor=>supervisor.id==this.chosenClinic.clinicalSupervisorId)[0];

	this.dashboardService.getAllAssignedCasesBySupervisor(this.currentSuperVisor.id).subscribe(
		data=>{
		
		  this.caseAssignedBySupervisor=data;
		  this.getCasesDetailsForAdmin();
		},
		err=>{
			
		}
	  )
}

  
//Modal methodd
open(content:string) 
{
	 this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'dark-modal'}).result.then((result) => {
	 this.closeResult = `Closed with: ${result}`;
	 }, (reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
	
			});
			
}

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

onSave()
{
	const assigned=new AssignedCase();
			assigned.dateAssigned=new Date()
			assigned.legalCaseId=this.chosenCase.id
			assigned.studentId=this.chosenStudent.id;

			this.dashboardService.addNewCaseAssignment(assigned).subscribe(
				data=>{
					this.dashboardService.getCaseById(assigned.legalCaseId).subscribe(
						data1=>{
							let newItem:CaseAssignedSupervisorsList=new CaseAssignedSupervisorsList()
							newItem.dateAssigned=new Date();
							newItem.id=assigned.legalCaseId;
							newItem.status=data1.status;
							newItem.subject=data1.subject;
							let student:Student=this.students.filter(aStudent=>aStudent.id==assigned.studentId)[0];
							newItem.studentName=student.firstName+" "+student.lastName;
							this.caseAssignedBySupervisor.push(newItem);
						}
					)
					this.createNotification(NotificationType.ADD,assigned.studentId,assigned.legalCaseId)
				},
				err=>{
				}
			)

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
			

			
			this.dashboardService.deleteCaseAssignmentByStudentIdAndCase(studentId,caseId).subscribe(
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
	this.dashboardService.addNotification(studentNotification).subscribe(
	data=>{
			this.mapNotification(data[0],studentId);
			  
		 },
	err=>
		{
		}
		  
	)

	if(this.currentRole==Roles.SUPERADMIN)
	{
		this.dashboardService.addNotification(supervisorNotification).subscribe(
			data=>{
					this.mapNotification(data[0],this.currentSuperVisor.id);
					  
				 },
			err=>
				{
				}
				  
			)
	}
}


	
	mapNotification(notificationId:string,receiverId:number)
	{
		let ng:NotificationManager=new NotificationManager();
		ng.unread=false;
		ng.notificationId=notificationId;
		ng.receiverId=receiverId
		this.dashboardService.mapNotificationToUser(ng).subscribe(
		data=>
		{
		},
		err=>
		{
		}
			
		)
		 
	}

}

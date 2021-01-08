import { Component, ViewEncapsulation } from '@angular/core';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { DashboardService } from 'src/app/dashboard.service';
import { Student } from 'src/app/_models/student';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';
import { ClinicalSupervisor } from 'src/app/_models/clinical-supervisor';
import { ActivatedRoute, Router } from '@angular/router';
import { Roles } from 'src/app/_models/roles.enum';
import jwt_decode from 'jwt-decode';
import { errorObject } from 'rxjs/internal-compatibility';



@Component({
	selector: 'app-ngbd-accordion-basic',
	templateUrl: 'students.component.html',
	encapsulation: ViewEncapsulation.None,
	styles: []
})
export class StudentsComponent {
	students!:Student[];
	supervisors!:ClinicalSupervisor[];
	closeResult='';
	currentRole:number=parseInt(localStorage.getItem("Role")+"")
	currentClinic=""
	studentInsertionGroup = new FormGroup({
		id:new FormControl(''),
		firstName: new FormControl(''),
		lastname: new FormControl(''),
		email:new FormControl(''),
		password: new FormControl(''),
		phoneNumber: new FormControl(''),
		supervisor: new FormControl(''),


	  });
	  

	constructor(private dashboardService:DashboardService,private modalService: NgbModal,
		private route:ActivatedRoute, private router:Router) {
			//Allowing reload component
			this.router.routeReuseStrategy.shouldReuseRoute = () =>
			{
				return false;
			}
			if (this.route.snapshot.paramMap.get('clinic')) {
				this.currentClinic=this.route.snapshot.paramMap.get('clinic')+"";
				
		   }
		   else
		   {
		   }
		   
		 this.getStudents();
		 this.getAllSuperVisors();
	 }
	beforeChange($event: NgbPanelChangeEvent) {
		if ($event.panelId === 'preventchange-2') {
			$event.preventDefault();
		}

		if ($event.panelId === 'preventchange-3' && $event.nextState === false) {
			$event.preventDefault();
		}
	}

	disabled = false;


	getStudents()
	{
		if(this.currentRole==Roles.STUDENT)
		{
			let decoded=JSON.stringify(jwt_decode(localStorage.getItem("authenticationToken")+""));
			let id:number=parseInt(JSON.parse(decoded).sub);
			this.dashboardService.getAllStudentsInMyClinic(id).subscribe(
			
				data=>
				{
					this.students=data;
				},
				err=>
				{
					
				}

			)
		}
		if(this.currentRole==Roles.SUPERADMIN)
		{
			let decoded=JSON.stringify(jwt_decode(localStorage.getItem("authenticationToken")+""));
			let id:number=parseInt(JSON.parse(decoded).sub);
			this.dashboardService.getAllStudentsInChosenClinic(this.currentClinic).subscribe(
			
				data=>
				{
					this.students=data;
				},
				err=>
				{
					
				}

			)
		}
		/*
		this.dashboardService.getAllStudents().subscribe(
		data=> {
			this.students=data;
		}
		

			);
			*/
	}

getAllSuperVisors()
{
	this.dashboardService.getAllSupervisors().subscribe(
		data=>{
		this.supervisors=data		}
	)
}

	//Modal methodd
	open(content:string,student:Student) {
		this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'dark-modal'}).result.then((result) => {
			this.closeResult = `Closed with: ${result}`;
			this.studentInsertionGroup.controls['firstName'].setValue("Yeah");
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

	private onSave()
	{
		const student = <Student>({
			id:this.studentInsertionGroup.get("id")?.value,
			firstName:this.studentInsertionGroup.get("firstName")?.value,
			lastname:this.studentInsertionGroup.get("lastname")?.value,
			password:"password",
			email:this.studentInsertionGroup.get("email")?.value,
			phoneNumber:this.studentInsertionGroup.get("phoneNumber")?.value,
			clinicalSupervisorName:"123"
		 });

		 this.dashboardService.addNewStudent(student).subscribe(
			 data=>{
				 console.log("data of add is "+data);

			 }
			 
		 )
	}

	onDelete(id:string)
	{
		this.dashboardService.deleteStudent(id).subscribe(

		);
	}

	onEdit()
	{
		const student = <Student>({
			id:this.studentInsertionGroup.get("id")?.value,
			firstName:this.studentInsertionGroup.get("firstName")?.value,
			lastname:this.studentInsertionGroup.get("lastname")?.value,
			password:"password",
			email:this.studentInsertionGroup.get("email")?.value,
			phoneNumber:this.studentInsertionGroup.get("phoneNumber")?.value,
			clinicalSupervisorName:this.studentInsertionGroup.get("supervisor")?.value
		 });

		 this.dashboardService.editStudent(student).subscribe(
		
			 
		 )
	}

}

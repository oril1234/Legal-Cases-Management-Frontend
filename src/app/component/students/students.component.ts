import { Component, ViewEncapsulation } from '@angular/core';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { DashboardService } from 'src/app/dashboard.service';
import { Student } from 'src/app/_models/student';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';
import { ClinicalSupervisor } from 'src/app/_models/clinical-supervisor';


@Component({
	selector: 'app-ngbd-accordion-basic',
	templateUrl: 'accordion.component.html',
	encapsulation: ViewEncapsulation.None,
	styles: [`
	  .dark-modal .modal-content {
		direction:rtr;
		width:60%
	  }
	  .dark-modal .close {
		color: black;
	  }
	  .light-blue-backdrop {
		background-color: #5cb3fd;
	  }
	`]
})
export class StudentsComponent {
	students!:Student[];
	supervisors!:ClinicalSupervisor[];
	closeResult='';
	studentInsertionGroup = new FormGroup({
		id:new FormControl(''),
		firstName: new FormControl(''),
		lastName: new FormControl(''),
		email:new FormControl(''),
		password: new FormControl(''),
		phoneNumber: new FormControl(''),
		supervisor: new FormControl(''),


	  });
	  

	constructor(private dashboardService:DashboardService,private modalService: NgbModal)
	 {
		 this.getAllStudents();
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


	getAllStudents()
	{
		this.dashboardService.getAllStudents().subscribe(
		data=> {
			this.students=data;
		}
		

			);
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
		}, (reason) => {
			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			alert(this.closeResult)

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
			clinicalSupervisorName:this.studentInsertionGroup.get("supervisor")?.value
		 });
	}

}

import {  Component, OnInit } from '@angular/core';
import { ClinicalSupervisor } from 'src/app/_models/clinical-supervisor';
import { DashboardService } from 'src/app/dashboard.service';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';




@Component({
  selector: 'app-ngbd-alert',
  templateUrl: 'supervisors.component.html',
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
export class SupervisorsComponent implements OnInit {
  // this is for the Closeable Alert

  public supervisors!:ClinicalSupervisor[];

	supervisorForm = new FormGroup({
		id:new FormControl(''),
    firstName:new FormControl(''),
		lastname: new FormControl(''),
		password: new FormControl(''),
		email: new FormControl(''),
		sinceYear:new FormControl(''),
    phoneNumber:new FormControl('')

	  });
    closeResult=""


  constructor(private dashboardService:DashboardService,private modalService: NgbModal) {
this.getAllSupervisors();
  }

  ngOnInit(): void {
    
  }
  getAllSupervisors()
  {
    this.dashboardService.getAllSupervisors().subscribe(
      data=> {
        this.supervisors=data;
      }
      
  
        );
  }

  	//Modal methodd
	open(content:string,String:string) {
		this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'dark-modal'}).result.then((result) => {
			this.closeResult = `Closed with: ${result}`;
			this.supervisorForm.controls['firstName'].setValue("Yeah");
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
		/*
    const supervisor= {
      id!: this.supervisorForm.get("id"),
      firstName!: this.supervisorForm.get("firstName"),
      lastname!:this.supervisorForm.get("lastname"),
      email!: this.supervisorForm.get("email"),
      phoneNumber!: this.supervisorForm.get("phoneNumber"),
      sinceYear!: this.supervisorForm.get("sinceYear"),

		 };
     */
     const supervisor:ClinicalSupervisor=new ClinicalSupervisor();
     supervisor.id=parseInt(this.supervisorForm.get("id")?.value+"");
     supervisor.firstName=this.supervisorForm.get("firstName")?.value+"";
     supervisor.lastname=this.supervisorForm.get("lastname")?.value+"";
     supervisor.email=this.supervisorForm.get("email")?.value+"";
     supervisor.phoneNumber=this.supervisorForm.get("phoneNumber")?.value+"";
     supervisor.sinceYear=parseInt(this.supervisorForm.get("sinceYear")?.value+"");
     supervisor.role="ClinicalSupervisor";

		 this.dashboardService.addNewSupervisor(supervisor).subscribe(
			 
		 )
	}

  
	onDelete(id:string)
	{
		this.dashboardService.deleteSupervisor(parseInt(id)).subscribe(

		);
	}

	onEdit()
	{
		const supervisor:ClinicalSupervisor=new ClinicalSupervisor();
		supervisor.id=parseInt(this.supervisorForm.get("id")?.value+"");
		supervisor.firstName=this.supervisorForm.get("firstName")?.value+"";
		supervisor.lastname=this.supervisorForm.get("lastname")?.value+"";
		supervisor.email=this.supervisorForm.get("email")?.value+"";
		supervisor.phoneNumber=this.supervisorForm.get("phoneNumber")?.value+"";
		supervisor.sinceYear=parseInt(this.supervisorForm.get("sinceYear")?.value+"");
		supervisor.role="ClinicalSupervisor";
		supervisor.password="password";

		 this.dashboardService.editSupervisor(supervisor).subscribe(
		
			 
		 )
	}

}



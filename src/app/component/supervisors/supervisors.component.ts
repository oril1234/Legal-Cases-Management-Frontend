import {  Component, OnInit } from '@angular/core';
import { ClinicalSupervisor } from 'src/app/_models/clinical-supervisor';
import { HttpService } from 'src/app/http.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';




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

//Component fot clinical supervisors details
export class SupervisorsComponent implements OnInit {

  //All clinical supevisors 		
  public supervisors!:ClinicalSupervisor[];

  //Clinical supervisor to add
  addedSupervisor:ClinicalSupervisor=new ClinicalSupervisor()

  //Clinical supervisor to edit
  edittedSupervisor:ClinicalSupervisor=new ClinicalSupervisor()

  //Reason to close modal window
closeResult=""


  constructor(private httpService:HttpService,private modalService: NgbModal) {
this.getAllSupervisors();
  }

  ngOnInit(): void {
    
  }
  getAllSupervisors()
  {
    this.httpService.getAllSupervisors().subscribe(
      data=> {
        this.supervisors=data;
      }
      
  
        );
  }

  	//Open add modal window
	openAddModal(content:string) {
		this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'dark-modal'}).result.then((result) => {
			this.closeResult = `Closed with: ${result}`;

		}, (reason) => {
			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

		});
		
	}

	//Open edit modal window
	openEditModal(supervisor:ClinicalSupervisor,content:string) {
		this.edittedSupervisor=Object.create(supervisor);
		this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'dark-modal'}).result.then((result) => {
			this.closeResult = `Closed with: ${result}`;

		}, (reason) => {
			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

		});
		
	}

	//Open delete modal window
	openDeleteModal(content:string)
	{
		this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'dark-modal'}).result.then((result) => {
			this.closeResult = `Closed with: ${result}`;

		}, (reason) => {
			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

		});
	}

	//Get reason to close modal window
	private getDismissReason(reason: ModalDismissReasons): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return  `with: ${reason}`;
		}
	}

	//Confirm add new clinical supervisor
	private onAdd()
	{

		this.addedSupervisor.sinceYear=new Date().getFullYear();
		this.addedSupervisor.imgUrl="";
		 this.httpService.addNewSupervisor(this.addedSupervisor).subscribe(
			data=>{
				this.supervisors.push(this.addedSupervisor);
			},
		 )
	}

  
	//Confirm delete clinical supervisor by id
	onDelete(id:number)
	{
		this.httpService.deleteSupervisor(id).subscribe(
			date=>{
				this.supervisors=this.supervisors.filter(cSupervisor=>cSupervisor.id!=id)
			}

		);
	}

	//Confirm edit clinical supervisor
	onEdit(index:number)
	{

		
		this.edittedSupervisor.firstName=this.edittedSupervisor.firstName;
        this.edittedSupervisor.lastName=this.edittedSupervisor.lastName;
        this.edittedSupervisor.id=this.edittedSupervisor.id;
        this.edittedSupervisor.email=this.edittedSupervisor.email;
        this.edittedSupervisor.phoneNumber=this.edittedSupervisor.phoneNumber;
        this.edittedSupervisor.imgUrl=this.edittedSupervisor.imgUrl;
        this.edittedSupervisor.password=this.edittedSupervisor.password;
		this.edittedSupervisor.role=this.edittedSupervisor.role;
		this.edittedSupervisor.sinceYear=this.edittedSupervisor.sinceYear;
		if(this.edittedSupervisor.password==null)
		this.edittedSupervisor.password="password";
		 this.httpService.editSupervisor(this.edittedSupervisor).subscribe(
			data=>{
				this.supervisors[index]=Object.create(this.edittedSupervisor)
			},
		 )
		 
	}

	//Validate new clinical supervisor fields
	validateAddedFields():boolean
	{
	  let isValidated=typeof this.addedSupervisor.id != 'undefined' && this.addedSupervisor.id!=null;
	  isValidated=isValidated && typeof this.addedSupervisor.firstName !== 'undefined' && this.addedSupervisor.firstName!="";
	  isValidated=isValidated && typeof this.addedSupervisor.lastName !== 'undefined' && this.addedSupervisor.lastName!="";
	  isValidated=isValidated && typeof this.addedSupervisor.email !== 'undefined' && this.validateEmail(this.addedSupervisor.email)
	  isValidated=isValidated && typeof this.addedSupervisor.phoneNumber !== 'undefined' && this.addedSupervisor.phoneNumber!=""
  
	  return isValidated;
	}
  
	//Validate edited clinical supervisor fields
	validateEdittedFields():boolean
	{
	  let isValidated=typeof this.edittedSupervisor.id !== 'undefined';
	  isValidated=isValidated && typeof this.edittedSupervisor.firstName !== 'undefined' && this.edittedSupervisor.firstName!="";
	  isValidated=isValidated && typeof this.edittedSupervisor.lastName !== 'undefined' && this.edittedSupervisor.lastName!="";
	  isValidated=isValidated && typeof this.edittedSupervisor.email !== 'undefined' && this.validateEmail(this.edittedSupervisor.email)
	  isValidated=isValidated && typeof this.edittedSupervisor.phoneNumber !== 'undefined' && this.edittedSupervisor.phoneNumber!=""
  
	  return isValidated;
	}

	validateEmail(email: string) {
		const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	  }

}



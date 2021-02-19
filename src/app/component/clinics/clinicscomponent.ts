import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { Clinic } from 'src/app/_models/clinic';
import { ClinicalSupervisor } from 'src/app/_models/clinical-supervisor';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dropdown-basic',
  templateUrl: './clinics.component.html'
})

/**
 * Class of component of all clinics details
 */
export class ClinicsComponent  implements OnInit {

  //Role of connected user
  currentRole=parseInt(localStorage.getItem("Role")+"");

  //All clinics dertails
  clinics:Clinic[]=[];

  //clinic object to add
  addedClinic:Clinic=new Clinic()

  //Object of an existing clinic to edit 
  edittedClinic:Clinic=new Clinic()

  //Details of clinical supervisors
  supervisors:ClinicalSupervisor[]=[];

  //Specific clinical supervisor
  supervisor:ClinicalSupervisor=new ClinicalSupervisor();

  //Reason to close a modal window
  closeResult=""


constructor(private httpService:HttpService,private modalService:NgbModal,private router: Router)
{
  this.getSupervisors();
  this.getAllClinics();
  
}
public ngOnInit(): void {
  this.router.routeReuseStrategy.shouldReuseRoute = () => false;
}


//Getting full name of clinical supervisor
getFullName(id:number):string
{
  let supervisor:ClinicalSupervisor= this.supervisors.filter(supervisor=>supervisor.id==id)[0];
  if(typeof supervisor=="undefined")
    return "";

  return supervisor.firstName+" "+supervisor.lastName;
}

//Open modal for adding a new clinic
openAddModal(content:string) 
{
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'dark-modal'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    
      });
        
}

	//Open modal for editing a clinic
  openEditModal(content:string,clinic:Clinic) 
  {
      this.edittedClinic=Object.create(clinic);
        
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'dark-modal'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          
      });
              
  }

  //Open modal for deleting a clinic
  openDeleteModal(content:string) 
  {
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'dark-modal'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    
      });
        
  }

//Get reason for closing modal window
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
    

  //Fetch all clinics
  getAllClinics()
  {

        this.httpService.getAllClinic().subscribe(
          data=> {
            //this.clinics=data;
            data.forEach(clinic=>{
              if(clinic.active)
                this.clinics=[clinic].concat(this.clinics);
              else
                this.clinics.push(clinic);  
            })
          },
          err=>
          {
          }
        )


  }

  //Fetch all clinical supervisors
  getSupervisors()
  {
    this.httpService.getAllSupervisors().subscribe(
      data=> {
        this.supervisors=data;
        this.supervisor=this.supervisors[0];

      }
      
  
        );
  }

  getSupervisorNamebyId(id:string):string
  {
    for(let supervisor of this.supervisors)

    {      
      if(supervisor.id==parseInt(id))
        return supervisor.firstName+' '+supervisor.lastName;
    }
    return "";        

  }


  //Confirm add new clinic to system
  onAdd()
	{

     this.addedClinic.clinicalSupervisorId=this.supervisor.id;
     this.addedClinic.yearFounded=new Date().getFullYear();
     this.addedClinic.active=true;
     this.addedClinic.description="תיאור "+this.addedClinic.clinicName;
  

		 this.httpService.addNewClinic(this.addedClinic).subscribe(
       data=>{
         if(this.addedClinic.active)
          this.clinics=[this.addedClinic].concat(this.clinics);
         else
           this.clinics.push(this.addedClinic);
       }
			 
		 )
	}

  //Checking name of a new clinic is not empty
  validateClinicNameForNewClinic():boolean
  {
    return typeof this.addedClinic.clinicName!="undefined" && this.addedClinic.clinicName.length>2;
  }

  //Checking description of a new clinic is valid
  validateClinicDescriptionForeditedClinic():boolean
  {
    return this.edittedClinic.description.length>2;
  }

  //Confirm delete of a clinic
	onDelete(clinicName:string)
	{
		
    
		this.httpService.deleteClinic(clinicName).subscribe(
      data=>{
        this.clinics=this.clinics.filter(clinic=>clinic.clinicName!=clinicName)
      }

		);
	}

  //Confirm edit of clinic
	onEdit(index:number)
	{

    this.edittedClinic.description=this.edittedClinic.description;
    this.edittedClinic.active=this.edittedClinic.active;
    this.edittedClinic.clinicName=this.edittedClinic.clinicName;
    this.edittedClinic.clinicalSupervisorId=this.edittedClinic.clinicalSupervisorId;
    this.edittedClinic.yearFounded=this.edittedClinic.yearFounded;
    
    
    this.httpService.updateClinicDetails(this.edittedClinic).subscribe(
      data=>{
        this.clinics[index]=Object.create(this.edittedClinic);
      },
      err=>{
        
      }
    )
    
    	
	}

  //Toggle activation of a clinic
  onChangeClinicState(index:number)
  {
    this.edittedClinic=Object.create(this.clinics[index]);
    this.edittedClinic.active=!this.edittedClinic.active;
    this.edittedClinic.description=this.edittedClinic.description;
    this.edittedClinic.active=this.edittedClinic.active;
    this.edittedClinic.clinicName=this.edittedClinic.clinicName;
    this.edittedClinic.clinicalSupervisorId=this.edittedClinic.clinicalSupervisorId;
    this.edittedClinic.yearFounded=this.edittedClinic.yearFounded;
    this.httpService.updateClinicDetails(this.edittedClinic).subscribe(
      data=>{
        
        this.clinics=this.clinics.filter(clinic=>this.edittedClinic.clinicName!=clinic.clinicName);
        if(this.edittedClinic.active)
          this.clinics=[Object.create(this.edittedClinic)].concat(this.clinics);
        else
          this.clinics.push(Object.create(this.edittedClinic));

      },
      err=>{
        
      }
    )
  }

 //Invoked from html when changing a clinical supervisor 
 onChange(content:string)
 {
   this.edittedClinic.clinicalSupervisorId=parseInt(content);
   
 } 
}

import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/dashboard.service';
import { Clinic } from 'src/app/_models/clinic';
import { ClinicalSupervisor } from 'src/app/_models/clinical-supervisor';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dropdown-basic',
  templateUrl: './clinics.component.html'
})
export class ClinicsComponent  implements OnInit {
  currentRole=parseInt(localStorage.getItem("Role")+"");
  clinics:Clinic[]=[];
  addedClinic:Clinic=new Clinic()
  edittedClinic:Clinic=new Clinic()
  supervisors:ClinicalSupervisor[]=[];
  supervisor:ClinicalSupervisor=new ClinicalSupervisor();
  closeResult=""

  clinicsForm = new FormGroup({
    clinicName:new FormControl(''),
    clinicalSupervisor:new FormControl(''),
    yearFounded:new FormControl('')

	  });
active:boolean=true;    
constructor(private dashboardService:DashboardService,private modalService:NgbModal,private router: Router)
{
  this.getSupervisors();
  this.getAllClinics();
  
}
public ngOnInit(): void {
  this.router.routeReuseStrategy.shouldReuseRoute = () => false;
}


getFullName(id:number):string
{
  let supervisor:ClinicalSupervisor= this.supervisors.filter(supervisor=>supervisor.id==id)[0];
  if(typeof supervisor=="undefined")
    return "";

  return supervisor.firstName+" "+supervisor.lastName;
}

	  	//Modal methodd
openAddModal(content:string) 
{
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'dark-modal'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    
      });
        
}

	//Modal methodd
  openEditModal(content:string,clinic:Clinic) 
  {
      this.edittedClinic=Object.create(clinic);
        
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'dark-modal'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          
      });
              
  }

  openDeleteModal(content:string) 
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
    

  getAllClinics()
  {

        this.dashboardService.getAllClinic().subscribe(
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

  getSupervisors()
  {
    this.dashboardService.getAllSupervisors().subscribe(
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


  onSave()
	{

     this.addedClinic.clinicalSupervisorId=this.supervisor.id;
     this.addedClinic.yearFounded=new Date().getFullYear();
     this.addedClinic.active=true;
     this.addedClinic.description="תיאור "+this.addedClinic.clinicName;
  

		 this.dashboardService.addNewClinic(this.addedClinic).subscribe(
       data=>{
         if(this.addedClinic.active)
          this.clinics=[this.addedClinic].concat(this.clinics);
         else
           this.clinics.push(this.addedClinic);
       }
			 
		 )
	}

	onDelete(clinicName:string)
	{
		
    
		this.dashboardService.deleteClinic(clinicName).subscribe(
      data=>{
        this.clinics=this.clinics.filter(clinic=>clinic.clinicName!=clinicName)
      }

		);
	}

	onEdit(index:number)
	{

    this.edittedClinic.description=this.edittedClinic.description;
    this.edittedClinic.active=this.edittedClinic.active;
    this.edittedClinic.clinicName=this.edittedClinic.clinicName;
    this.edittedClinic.clinicalSupervisorId=this.edittedClinic.clinicalSupervisorId;
    this.edittedClinic.yearFounded=this.edittedClinic.yearFounded;
    //alert(this.edittedClinic.clinicalSupervisorId)
    
    
    this.dashboardService.updateClinicDetails(this.edittedClinic).subscribe(
      data=>{
        this.clinics[index]=Object.create(this.edittedClinic);
      },
      err=>{
        
      }
    )
    
    	
	}

  onChangeClinicState(index:number)
  {
    this.edittedClinic=Object.create(this.clinics[index]);
    this.edittedClinic.active=!this.edittedClinic.active;
    this.edittedClinic.description=this.edittedClinic.description;
    this.edittedClinic.active=this.edittedClinic.active;
    this.edittedClinic.clinicName=this.edittedClinic.clinicName;
    this.edittedClinic.clinicalSupervisorId=this.edittedClinic.clinicalSupervisorId;
    this.edittedClinic.yearFounded=this.edittedClinic.yearFounded;
    this.dashboardService.updateClinicDetails(this.edittedClinic).subscribe(
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

 onChange(content:string)
 {
   this.edittedClinic.clinicalSupervisorId=parseInt(content);
   
 } 
}

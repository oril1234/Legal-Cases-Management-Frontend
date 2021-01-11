import { Component } from '@angular/core';
import { DashboardService } from 'src/app/dashboard.service';
import { Clinic } from 'src/app/_models/clinic';
import { ClinicalSupervisor } from 'src/app/_models/clinical-supervisor';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dropdown-basic',
  templateUrl: './clinics.component.html'
})
export class ClinicsComponent {
  currentRole=parseInt(localStorage.getItem("Role")+"");
  clinics!:Clinic[]
  supervisors!:ClinicalSupervisor[];
  closeResult=""

  clinicsForm = new FormGroup({
    clinicName:new FormControl(''),
    clinicalSupervisor:new FormControl(''),
    yearFounded:new FormControl('')

	  });
constructor(private dashboardService:DashboardService,private modalService:NgbModal)
{
  this.getSupervisors();
  this.getAllClinics();
  
}

	  	//Modal methodd
		  open(content:string,legalcase:Clinic) {
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'dark-modal'}).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    
        });
        
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
    

  getAllClinics()
  {

        this.dashboardService.getAllClinic().subscribe(
          data=> {
            this.clinics=data;
          
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

      }
      
  
        );
  }
  getSupervisorNamebyId(id:string):string
  {
    for(let supervisor of this.supervisors)

    {      
      if(supervisor.id==parseInt(id))
        return supervisor.firstName+' '+supervisor.lastname;
    }
return "";    

  }


  onSave()
	{

     const clinic:Clinic=new Clinic();
     clinic.clinicName=this.clinicsForm.get("clinicName")?.value;
     clinic.clinicalSupervisorId=parseInt(this.clinicsForm.get("clinicalSupervisorID")?.value);
     clinic.yearFounded=new Date().getFullYear();
  

		 this.dashboardService.addNewClinic(clinic).subscribe(
			 
		 )
	}

	onDelete(id:string)
	{
		
		this.dashboardService.deleteClinic(parseInt(id)).subscribe(

		);
	}

	onEdit(clinicToEdit:Clinic)
	{
    const clinic:Clinic=new Clinic();
    clinic.clinicName=clinicToEdit.clinicName;
    clinic.clinicalSupervisorId=clinicToEdit.clinicalSupervisorId;
    clinic.yearFounded=clinicToEdit.yearFounded;
 
    this.dashboardService.addNewClinic(clinic).subscribe(
      
    )
		 
		
	}
}

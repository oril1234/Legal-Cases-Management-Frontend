import { Component } from '@angular/core';
import { DashboardService } from 'src/app/dashboard.service';
import { Clinic } from 'src/app/_models/clinic';
import { ClinicalSupervisor } from 'src/app/_models/clinical-supervisor';

@Component({
  selector: 'app-dropdown-basic',
  templateUrl: './clinics.component.html'
})
export class ClinicsComponent {
  clinics!:Clinic[]
  supervisors!:ClinicalSupervisor[];
constructor(private dashboardService:DashboardService)
{
  this.getSupervisors();
  this.getAllClinics();
  
}

  getAllClinics()
  {
		this.dashboardService.getAllClinic().subscribe(
			data=> {
				this.clinics=data;

			}
			
	
				);

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

      if(supervisor.id==id)
        return supervisor.firstName+' '+supervisor.lastname;
return "";    

  }
}

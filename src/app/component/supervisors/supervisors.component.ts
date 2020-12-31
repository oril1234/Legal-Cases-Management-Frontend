import {  Component, OnInit } from '@angular/core';
import { ClinicalSupervisor } from 'src/app/_models/clinical-supervisor';
import { DashboardService } from 'src/app/dashboard.service';


@Component({
  selector: 'app-ngbd-alert',
  templateUrl: 'supervisors.component.html',
  styles: [`
    :host >>> .alert-custom {
      color: #99004d;
      background-color: #f169b4;
      border-color: #800040;
    }
  `]
})
export class SupervisorsComponent implements OnInit {
  // this is for the Closeable Alert

  public supervisors!:ClinicalSupervisor[];
  constructor(private dashboardService:DashboardService) {
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


}

export interface IAlert {
  id: number;
  type: string;
  message: string;
}

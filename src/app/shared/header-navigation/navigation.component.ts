import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/dashboard.service';
import {Roles} from '../../_models/roles.enum'
import jwt_decode from "jwt-decode"
import { Person } from 'src/app/_models/person';

declare var $: any;

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html'
})

export class NavigationComponent {
  @Output()
  toggleSidebar = new EventEmitter<void>();

  userId = 0
  person:Person=new Person()  

  public showSearch = false;
  currentRole:Roles=Roles.STUDENT;
  constructor(public router: Router,private dashboardService:DashboardService) {
    this.router = router;
    if(localStorage.getItem("authenticationToken")!=null){
        this.userId=parseInt(
          JSON.parse(
            JSON.stringify(
            jwt_decode(localStorage.getItem("authenticationToken") + "")
            )
          ).sub);
       this.currentRole=parseInt(localStorage.getItem("Role")+"");
       console.log("Nav role " + this.currentRole.toString());
    }
    this.getPersonDetails();
  }

  logout()
  {
    localStorage.removeItem("Role");
    localStorage.removeItem("authenticationToken");
    this.router.navigate(['/login']);
  }


  getPersonDetails()
  {
    this.dashboardService.getPersonById(this.userId).subscribe(
      data=>{
        this.person=data;
      }
    )  
  }
}

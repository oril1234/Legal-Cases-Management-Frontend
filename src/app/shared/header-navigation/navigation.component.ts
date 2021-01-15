import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import {Roles} from '../../_models/roles.enum'
declare var $: any;

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html'
})

export class NavigationComponent {
  @Output()
  toggleSidebar = new EventEmitter<void>();

  public showSearch = false;
  currentRole:Roles=Roles.STUDENT;
  constructor(public router: Router) {
    this.router = router;
    if(localStorage.getItem("authenticationToken")!=null){
       this.currentRole=parseInt(localStorage.getItem("Role")+"");
       console.log("Nav role " + this.currentRole.toString());
    }
  }

  logout()
  {
    localStorage.removeItem("Role");
    localStorage.removeItem("authenticationToken");
    this.router.navigate(['/login']);
  }
}

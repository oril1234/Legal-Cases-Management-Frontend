import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ROUTES } from './menu-items';
import { RouteInfo } from './sidebar.metadata';
import { Router, ActivatedRoute,ParamMap } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Roles } from 'src/app/_models/roles.enum';
import { AuthService } from 'src/app/auth/shared/auth.service';
import jwt_decode from 'jwt-decode'
import { DashboardService } from 'src/app/dashboard.service';
import { Clinic } from 'src/app/_models/clinic';

declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  showMenu = '';
  showSubMenu = '';
  public sidebarnavItems: RouteInfo[]=[];
  currentRole:Roles=parseInt(localStorage.getItem("Role")+"");
  showSub=false;
  clinics!:Clinic[];


  // this is for the open close
  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private authservice:AuthService,
    private dashboardService:DashboardService
  ) {

    if(this.currentRole==2)
    {
      this.getAllClinics();
    }
  }

  // End open close
  ngOnInit() {
   
    
    let a=JSON.stringify(jwt_decode(localStorage.getItem("authenticationToken")+""));
    let decoded=JSON.parse(a);
        this.sidebarnavItems = ROUTES.filter(sidebarnavItem => sidebarnavItem.role.includes(this.currentRole));
  }

  getAllClinics()
  {
    this.dashboardService.getAllClinic().subscribe(
      data=>
      {
        this.clinics=data;
      }
    )
    
  }
}

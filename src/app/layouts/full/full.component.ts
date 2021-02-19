import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import {Roles} from '../../_models/roles.enum'
import {AuthService} from '../../auth/shared/auth.service'
import jwt_decode from "jwt-decode"
import { HttpService } from 'src/app/http.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { Person } from 'src/app/_models/person';
declare var $: any;

@Component({
  selector: 'app-full-layout',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss']
})
export class FullComponent implements OnInit {

	public config: PerfectScrollbarConfigInterface = {};

  person:Person=new Person()
  userId = 0
  notificationsNumber=0;
  showNotifications:boolean=true

  constructor(public router: Router,private authservice:AuthService,private httpService:HttpService,
    private notificationsService:NotificationsService) {

    if(localStorage.getItem("authenticationToken")!=null)
    {
     this.userId= parseInt(
        JSON.parse(
          JSON.stringify(
          jwt_decode(localStorage.getItem("authenticationToken") + "")
          )
        ).sub);
    this.getPersonDetails();
    this.getFullName();
    this.getNotifications();
    this.currentRole=parseInt(localStorage.getItem("Role")+"");
    }
  }

  public innerWidth: number=0;
  public defaultSidebar='';
  public showMobileMenu = false;
  public expandLogo = false;
  public sidebartype = 'full';
  currentRole:Roles=Roles.STUDENT;
  fullName:string

  Logo() {
    this.expandLogo = !this.expandLogo;
  }

  ngOnInit() {
    
    //this.getNotifications();
    if (this.router.url === '/') {
      this.router.navigate(['/starter']);
     
     this.notificationsService.shouldShowNotifications.subscribe(currentState=>
      {
        this.showNotifications=currentState
      }) 
    }
    
   
 
    this.defaultSidebar = this.sidebartype;
    this.handleSidebar();
  }

  getNotifications()
  {
    let decoded=jwt_decode(localStorage.getItem("authenticationToken")+"")
    let id:number=parseInt(JSON.parse(JSON.stringify(decoded)).sub);
    
    this.httpService.getNotificationsNumberByPersonID(id).subscribe(
      data=>{
        this.notificationsNumber=data;
        
      },
      err=>
      {
      }
    )
  
  }

  getFullName()
  {
    let id=JSON.parse(JSON.stringify(jwt_decode(localStorage.getItem("authenticationToken")+""))).sub;
    this.httpService. getPersonFullNameById(id).subscribe(
      data=>{
        this.fullName=data[0];

      },
      err=>
      {
       
      }
    )
  }

  getPersonDetails()
  {
    this.httpService.getPersonById(this.userId).subscribe(
      data=>
     { 
       this.person=data;
       
    
    }
    )
  }

  @HostListener('window:resize', ['$event'])
  onResize(event:string) {
    this.handleSidebar();
  }

  handleSidebar() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 1170) {
      this.sidebartype = 'mini-sidebar';
    } else {
      this.sidebartype = this.defaultSidebar;
    }
  }

  logout()
  {
    localStorage.removeItem("Role");
    localStorage.removeItem("authenticationToken");
    this.router.navigate(['/login']);
  }

  toggleSidebarType() {
    switch (this.sidebartype) {
      case 'full':
        this.sidebartype = 'mini-sidebar';
        break;

      case 'mini-sidebar':
        this.sidebartype = 'full';
        break;

      default:
    }
  }
  
}
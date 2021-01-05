import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ROUTES } from './menu-items';
import { RouteInfo } from './sidebar.metadata';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Roles } from 'src/app/_models/roles.enum';
import { AuthService } from 'src/app/auth/shared/auth.service';
declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  showMenu = '';
  showSubMenu = '';
  public sidebarnavItems: RouteInfo[]=[];
  currentRole:Roles=Roles.STUDENT


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
    private authservice:AuthService
  ) {}

  // End open close
  ngOnInit() {
    this.router.events.subscribe()
    this.authservice.role.asObservable().subscribe(
      value=>{
        this.currentRole=value;
        this.sidebarnavItems = ROUTES.filter(sidebarnavItem => sidebarnavItem.role.includes(value));
      }
    )
    
  }
}

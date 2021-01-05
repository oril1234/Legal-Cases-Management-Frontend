import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import {Roles} from '../../_models/roles.enum'
import {AuthService} from '../../auth/shared/auth.service'
declare var $: any;

@Component({
  selector: 'app-full-layout',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss']
})
export class FullComponent implements OnInit {

	public config: PerfectScrollbarConfigInterface = {};

  constructor(public router: Router,private authservice:AuthService) {}

  public innerWidth: number=0;
  public defaultSidebar='';
  public showMobileMenu = false;
  public expandLogo = false;
  public sidebartype = 'full';
  currentRole:Roles=Roles.STUDENT;

  Logo() {
    this.expandLogo = !this.expandLogo;
  }

  ngOnInit() {
    if (this.router.url === '/') {
      this.router.navigate(['/starter']);
    }
    this.authservice.role.asObservable().subscribe(
      value =>{
        this.currentRole=value;
      }
    )
    this.defaultSidebar = this.sidebartype;
    this.handleSidebar();
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

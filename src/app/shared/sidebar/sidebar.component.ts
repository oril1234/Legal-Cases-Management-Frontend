import { Component, AfterViewInit, OnInit, HostListener } from '@angular/core';
import { ROUTES } from './menu-items';
import { RouteInfo } from './sidebar.metadata';
import { Router, ActivatedRoute,ParamMap } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Roles } from 'src/app/_models/roles.enum';
import { AuthService } from 'src/app/auth/shared/auth.service';
import jwt_decode from 'jwt-decode'
import { HttpService } from 'src/app/http.service';
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
  dropDownOpen:boolean=false;


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
    private httpService:HttpService
  ) {


  }

  // End open close
  ngOnInit() {
    this.sidebarnavItems = ROUTES.filter(sidebarnavItem => sidebarnavItem.role.includes(this.currentRole));
    if(this.currentRole==Roles.SUPERADMIN)
    {
      this.getAllClinics();
    }
    
  }

  getAllClinics()
  {
    this.httpService.getAllClinic().subscribe(
      data=>
      {
        this.clinics=data;
      },
      err=>{
      },
      ()=>{
        this.loadDataForSuperAdmin();
      }
    )
    
  }

  loadDataForSuperAdmin()
  {
    let a=JSON.stringify(jwt_decode(localStorage.getItem("authenticationToken")+""));
    let decoded=JSON.parse(a);
    this.sidebarnavItems.forEach(element=>
    {
      if( this.currentRole==Roles.SUPERADMIN)
            {
             
              if(element.path=='/component/legalCases')
              {
                element.submenu=[]
                
                element.submenu.push(
                  {
                    path: element.path+'/allInCourt',
                    title: 'תיקים בטיפול בית משפט',
                    icon: 'mdi mdi-account-box',
                    class: '',
                    extralink: false,
                    submenu:[],
                    role:[],
                    params:"",
                    hasSub:false,
                    showSub:false
                  });
    
                  element.submenu.push(
                    {
                      path: element.path+'/notInCourt',
                      title: 'תיקים לא בטיפול בית משפט',
                      icon: 'mdi mdi-account-box',
                      class: '',
                      extralink: false,
                      submenu:[],
                      role:[],
                      params:"",
                      hasSub:false,
                      showSub:false
                    });
    
                    element.submenu.push(
                      {
                        path: '/component//policy_paper',
                        title: 'מסמכי מדיניות',
                        icon: 'mdi mdi-account-box',
                        class: '',
                        extralink: false,
                        submenu:[],
                        role:[],
                        params:"",
                        hasSub:false,
                        showSub:false
                      });
    

              }

              if(element.path=='/component/students')
              {
                element.submenu=[]
                this.clinics.forEach(item=>
                  {
                    element.submenu.push(
                      {
                        path:element.path+'/'+item.clinicName,
                        title: item.clinicName,
                        icon: 'mdi mdi-account-box',
                        class: '',
                        extralink: false,
                        submenu:[],
                        role:[],
                        params:"",
                        hasSub:false,
                        showSub:false
                      });
                  })
              }

            }
          })
  }


  toggleDropDown(item:RouteInfo)
  {
    
    if(item.hasSub)
    {
     item.showSub=!item.showSub
    }

  }


}

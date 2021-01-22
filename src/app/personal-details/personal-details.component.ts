import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import jwt_decode from "jwt-decode";
import { DashboardService } from '../dashboard.service';
import { Person } from '../_models/person';


@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.css']
})
export class PersonalDetailsComponent implements OnInit {


  userId = parseInt(
		JSON.parse(
			JSON.stringify(
				jwt_decode(localStorage.getItem("authenticationToken") + "")
			)
		).sub);
    person:Person=new Person();
    personToEdit=new Person()
    editPhoneNumber:boolean=false;
    editEmail:boolean=false
    editPassword:boolean=false;
    editPhoto:boolean=false;
    currentPassword:string=""
    newPassword:string=""
    newPasswordRetyped:string=""
    photoUrl:string=""
  
    
    constructor(private dashboardService: DashboardService, private modalService: NgbModal,
      private route: ActivatedRoute,
      private router: Router
    )
    
    {

      this.getPersonDetails()
  
    }

	public ngOnInit(): void
	{
		this.router.routeReuseStrategy.shouldReuseRoute = () => false;

	}

  getPersonDetails()
  {
    this.dashboardService.getPersonById(this.userId).subscribe(
      data=>{
        
        this.person=data;
        this.personToEdit=data;
      },
      err=>
      {
        
      }
    )
  }


  editPerson()
  {
    this.resetBooleanFields();
    this.dashboardService.editPerson(this.person).subscribe(
      data=>{
        this.resetBooleanFields()
      },
      err=>{
        this.resetBooleanFields()
      }
    )
  }

  resetBooleanFields()
  {
    this.editPhoneNumber=false;
    this.editEmail=false;
    this.editPassword=false;
    this.editPhoto=false;

    this.person.phoneNumber=this.personToEdit.phoneNumber;
    this.person.email=this.personToEdit.email;

    this.currentPassword=""
    this.newPassword=""
    this.newPasswordRetyped=""

  }

  checkValidPassword():boolean
  {
    return  this.currentPassword!="" && this.newPassword!="" && this.newPasswordRetyped!="";
  }

  updatePhoto()
  {
    
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import jwt_decode from "jwt-decode";
import { HttpService } from '../http.service';
import { Person } from '../_models/person';


@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.css']
})

//Component to display all personal details of connected user
export class PersonalDetailsComponent implements OnInit {


  //Id of connected user
  userId = parseInt(
		JSON.parse(
			JSON.stringify(
				jwt_decode(localStorage.getItem("authenticationToken") + "")
			)
		).sub);

    //Details of connected iser
    person:Person=new Person();

    //Existing person to edit details for
    personToEdit:Person=new Person()


    editPhoneNumber:boolean=false;
    editEmail:boolean=false
    editPassword:boolean=false;
    editPhoto:boolean=false;
    currentPassword:string=""
    newPassword:string=""
    newPasswordRetyped:string=""
    photoUrl:string=""
  
    
    constructor(private httpService: HttpService, private modalService: NgbModal,
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
    this.httpService.getPersonById(this.userId).subscribe(
      data=>{
        
        this.person=data;
        console.log(this.person)
        
      },
      err=>
      {
        
      }
    )
  }

  startEdit()
  {
    this.personToEdit=Object.create(this.person);
    
  }


  editPerson()
  {
    this.personToEdit.email=this.personToEdit.email;
    this.personToEdit.firstName=this.personToEdit.firstName;
    this.personToEdit.id=this.personToEdit.id;
    this.personToEdit.imgUrl=this.personToEdit.imgUrl;
    this.personToEdit.lastName=this.personToEdit.lastName;
    this.personToEdit.password=this.personToEdit.password;
    this.personToEdit.phoneNumber=this.personToEdit.phoneNumber;
    this.personToEdit.role=this.personToEdit.role;
    this.httpService.editPerson(this.personToEdit).subscribe(
      data=>{

        this.person=Object.create(this.personToEdit);
        
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


    this.currentPassword=""
    this.newPassword=""
    this.newPasswordRetyped=""

  }

  checkValidPassword():boolean
  {
    return  this.currentPassword!="" && this.newPassword!="" && this.newPasswordRetyped!="";
  }

}

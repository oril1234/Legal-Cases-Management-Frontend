import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import jwt_decode from "jwt-decode";
import { HttpService } from '../http.service';
import { ClinicalSupervisor } from '../_models/clinical-supervisor';
import { Person } from '../_models/person';
import { Roles } from '../_models/roles.enum';
import { Student } from '../_models/student';


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

    //Role of current user
	  currentRole=parseInt(localStorage.getItem('Role')+"");

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

    if(this.currentRole==Roles.STUDENT)
    {
      this.httpService.getStudentById(this.userId).subscribe(
        data=>{

          let studentToUpdate:Student=new Student();
          studentToUpdate.email=this.personToEdit.email;
          studentToUpdate.firstName=this.personToEdit.firstName;
          studentToUpdate.id=this.personToEdit.id;
          studentToUpdate.imgUrl=this.personToEdit.imgUrl;
          studentToUpdate.lastName=this.personToEdit.lastName;
          studentToUpdate.password=this.newPassword;
          studentToUpdate.phoneNumber=this.personToEdit.phoneNumber;
          studentToUpdate.role=this.personToEdit.role;
          studentToUpdate.clinicalSupervisorId=data.clinicalSupervisorId;
          this.httpService.editStudent(studentToUpdate).subscribe(
            response=>{
              this.person=Object.create(this.personToEdit);
              this.resetBooleanFields()
            }
          )

          
        }
      )

    }

    else
    {
      this.httpService.getClinicalSupervisorById(this.userId).subscribe(
        data=>{

          let supervisorToUpdate:ClinicalSupervisor=new ClinicalSupervisor();
          supervisorToUpdate.email=this.personToEdit.email;
          supervisorToUpdate.firstName=this.personToEdit.firstName;
          supervisorToUpdate.id=this.personToEdit.id;
          supervisorToUpdate.imgUrl=this.personToEdit.imgUrl;
          supervisorToUpdate.lastName=this.personToEdit.lastName;
          supervisorToUpdate.password=this.personToEdit.password;
          supervisorToUpdate.phoneNumber=this.personToEdit.phoneNumber;
          supervisorToUpdate.role=this.personToEdit.role;
          supervisorToUpdate.sinceYear=data.sinceYear;
          this.httpService.editSupervisor(supervisorToUpdate).subscribe(
            response=>{
              this.person=Object.create(this.personToEdit);
              this.resetBooleanFields()
            }
          )

          
        }
      )
    }

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
    return  this.newPassword!="" && this.newPasswordRetyped!="" && this.newPassword==this.newPasswordRetyped;
  }

}

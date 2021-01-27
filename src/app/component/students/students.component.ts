import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { NgbPanelChangeEvent } from "@ng-bootstrap/ng-bootstrap";
import { DashboardService } from "src/app/dashboard.service";
import { Student } from "src/app/_models/student";
import {
  NgbModal,
  ModalDismissReasons,
  NgbActiveModal,
} from "@ng-bootstrap/ng-bootstrap";
import { FormControl, FormGroup } from "@angular/forms";
import { ClinicalSupervisor } from "src/app/_models/clinical-supervisor";
import { ActivatedRoute, Router } from "@angular/router";
import { Roles } from "src/app/_models/roles.enum";
import jwt_decode from "jwt-decode";
import { errorObject } from "rxjs/internal-compatibility";
import { Clinic } from "src/app/_models/clinic";
import {Person } from "src/app/_models/person";
import { NotificationtsToUsers } from "src/app/_models/notification";
import { NotificationType } from "src/app/_models/notification-type.enum";
import { NotificationManager } from "src/app/_models/notification-manager";

@Component({
  selector: "app-ngbd-accordion-basic",
  templateUrl: "students.component.html",
  encapsulation: ViewEncapsulation.None,
  styles: [],
})
export class StudentsComponent implements OnInit {
  
  person:Person=new Person()
  
  //Studnts in clinic 
  students!: Student[];
  
  //All Supervisors 
  supervisors!: ClinicalSupervisor[];

  //string representing the result of closing a modal
  closeResult = "";

  //The role of the connected user
  currentRole: number = parseInt(localStorage.getItem("Role") + "");

  //The clinic of which students are displayed
  currentClinic = "";

  //Object of a new student to add to system
  addedStudent: Student=new Student();

  //Object to hold a reference of an existing student that is editted
  edittedStudent: Student=new Student();;

  //The name of the supervisor of the current clinic
  supervisorName: string = "";

  //The id number of the supervisor of the current clinic
  supervisorId:number

  //Id of connected user
  userId = parseInt(
    JSON.parse(
      JSON.stringify(
        jwt_decode(localStorage.getItem("authenticationToken") + "")
      )
    ).sub);


    isDisabled:boolean=true; 

  constructor(
    private dashboardService: DashboardService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router
  ) {
  
    //Allowing reload component
    if (this.route.snapshot.paramMap.get("clinic")) {
      this.currentClinic = this.route.snapshot.paramMap.get("clinic") + "";
    }

    this.getPersonDetails();
    this.getStudents();
    this.getAllSuperVisors();
  }

  public ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

  }

  getPersonDetails()
  {
    this.dashboardService.getPersonById(this.userId).subscribe(
      data=>{
    this.person=data;
      }
    )

    
  }

  getStudents() 
  {
    //Fetching students with connected student in the same clinic
    if (this.currentRole == Roles.STUDENT) 
    {

      this.dashboardService.getAllStudentsInMyClinic(this.userId).subscribe(
        (data) => {
          this.students = data;
        },
        (err) => {}
      );
    }


    if (this.currentRole == Roles.SUPERADMIN) 
    {
          this.dashboardService.getAllClinic().subscribe((data1) => 
          {
            let clinics: Clinic[] = data1;
            clinics = clinics.filter(
              (clinic) => clinic.clinicName == this.currentClinic
            );
            let supervisorid = clinics[0].clinicalSupervisorId;
            this.dashboardService.getAllStudents().subscribe(
                (data) => {
                  this.students = data;
                  this.students = this.students.filter(
                    (student) => student.clinicalSupervisorId == supervisorid
                  );
                  console.log(this.students[0])
                  this.getAllSuperVisors();

          },
          (err) => {}
        );
      });
    }

    if (this.currentRole == Roles.SUPERVISOR) 
    {

      this.dashboardService.getAllStudents().subscribe(
        (data) => 
        {
          this.students = data;
          this.students = this.students.filter(
            (student) => student.clinicalSupervisorId ==this.userId
          );
        },
        (err) => {}
      );

      this.dashboardService.getAllSupervisors().subscribe(
        data=>{
          data.forEach(item=>{
            if(item.id==this.userId)
            {
              this.supervisorName=item.firstName+" "+item.lastName;
            }
          })
        }
      )
    }
  }

  getAllSuperVisors() 
  {

    this.dashboardService.getAllSupervisors().subscribe((data) => {
      this.supervisors = data;
      if(this.currentRole==Roles.SUPERVISOR)
        {
          this.supervisors=this.supervisors.filter(supervisor=>supervisor.id==this.userId);
          this.supervisorName=this.supervisors[0].firstName+" "+this.supervisors[0].lastName;
          this.supervisorId=this.supervisors[0].id;

        }
      else if(this.currentRole==Roles.SUPERADMIN){
        this.dashboardService.getAllClinic().subscribe(
          data=>{
            data=data.filter(clinic=>clinic.clinicName==this.currentClinic);
            this.currentClinic=data[0].clinicName;
            this.supervisors=this.supervisors.filter(supervisor=>supervisor.id==data[0].clinicalSupervisorId)
            this.supervisorName=this.supervisors[0].firstName+" "+this.supervisors[0].lastName;
            this.supervisorId=this.supervisors[0].id;
            console.log(this.supervisors[0])

          }
        )



      }  

    });
  }

  //Modal methodd
  openAddModal(content: string, student: Student) {
    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        size: "lg",
        windowClass: "dark-modal",
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  openEditModal(content: string, student: Student) {
    this.edittedStudent=Object.create(student);
    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        size: "lg",
        windowClass: "dark-modal",
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  openDeleteModal(content: string) {
    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        size: "lg",
        windowClass: "dark-modal",
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  private getDismissReason(reason: ModalDismissReasons): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  private onSave() {


    this.addedStudent.imgUrl="data:image/jpeg;base64,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";
    let detected: boolean = false;
    this.dashboardService.getAllSupervisors().subscribe((data) => {
      data.forEach((supervisor) => 
      {
        if 
        (
          supervisor.firstName + " " + supervisor.lastName ==
          this.supervisorName
        ) 
        {
          this.addedStudent.clinicalSupervisorId = supervisor.id;
          detected = true;
        }
      });
      if (detected) {
        
        this.dashboardService.addNewStudent(this.addedStudent).subscribe(
          (data) => 
          {
          this.students.push(this.addedStudent)  
          this.createNotification(NotificationType.ADD);  
            
          },
          err=>{
          }
        );
      }
    });
    
  }

  validateAddedFields():boolean
  {
    let isValidated=typeof this.addedStudent.id !== 'undefined';
    isValidated=isValidated && typeof this.addedStudent.firstName !== 'undefined' && this.addedStudent.firstName!="";
    isValidated=isValidated && typeof this.addedStudent.lastName !== 'undefined' && this.addedStudent.lastName!="";
    isValidated=isValidated && typeof this.addedStudent.email !== 'undefined' && this.validateEmail(this.addedStudent.email)
    isValidated=isValidated && typeof this.addedStudent.phoneNumber !== 'undefined' && this.addedStudent.phoneNumber!=""

    return isValidated;
  }

  validateEdittedFields():boolean
  {
    let isValidated=typeof this.edittedStudent.id !== 'undefined';
    isValidated=isValidated && typeof this.edittedStudent.firstName !== 'undefined' && this.edittedStudent.firstName!="";
    isValidated=isValidated && typeof this.edittedStudent.lastName !== 'undefined' && this.edittedStudent.lastName!="";
    isValidated=isValidated && typeof this.edittedStudent.email !== 'undefined' && this.validateEmail(this.edittedStudent.email)
    isValidated=isValidated && typeof this.edittedStudent.phoneNumber !== 'undefined' && this.edittedStudent.phoneNumber!=""

    return isValidated;
  }

  onDelete(id: number) {
    this.dashboardService.deleteStudent(id).subscribe(
      data=>{
        this.students=this.students.filter(student=>student.id!=id)
        this.createNotification(NotificationType.DELETE)
      }
    );
  }

  
	onEdit(student:Student)
	{

    let detected: boolean = false;
    this.dashboardService.getAllSupervisors().subscribe((data) => {
      data.forEach((supervisor) => {
        if (
          supervisor.firstName + " " + supervisor.lastName ==
          this.supervisorName
        ) {
          this.edittedStudent.clinicalSupervisorId = supervisor.id;
          detected = true;
        }
      });
      if (detected) {
        alert("THe password is "+this.edittedStudent.password)
        this.dashboardService.editStudent(this.edittedStudent).subscribe((data) => {
          student=Object.create(this.edittedStudent);
          this.createNotification(NotificationType.EDIT)
        });
      }
    });
	}
	

  validateEmail(email: string) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  createNotification(type:NotificationType)
  {
    if(this.currentRole!=Roles.SUPERADMIN)
      return;
    let n:NotificationtsToUsers=new NotificationtsToUsers();
    n.dateTime=new Date();
    n.sourceId=this.userId
    
      if(type==NotificationType.ADD)
      {
        n.details=this.person.firstName+" "+this.person.lastName+" הוסיף סטודנט חדש לקליניקה שלך";
      }
      if(type==NotificationType.EDIT)
      {
        n.details=this.person.firstName+" "+this.person.lastName+" ערך פרטים של סטודנט בקליניקה שלך";
      }
      if(type==NotificationType.DELETE)
      {
        n.details=this.person.firstName+" "+this.person.lastName+" מחק סטודנט מהקליניקה מהקליניקה שלך";
      }
    this.dashboardService.addNotification(n).subscribe(
      data=>{
        this.mapNotification(data[0]);
        
      },
      err=>
      {
      }
    )
  }

  mapNotification(notificationId:string)
  {
    let ng:NotificationManager=new NotificationManager();
    ng.unread=false;
    ng.notificationId=notificationId;
    
    if(this.currentRole==Roles.SUPERADMIN)
    {
      ng.receiverId=this.supervisorId;
      this.addNotificationToUser(ng)

    }
    else{
      this.dashboardService.getAllPersons().subscribe(
        data=>{
          data.forEach(person=>{
            if(person.role=="Super Admin")
            {

              ng.receiverId=person.id;
            }

          })
          this.addNotificationToUser(ng)

        }
      )
      
    }

  }

  addNotificationToUser(notificationManager:NotificationManager)
  {
    this.dashboardService.mapNotificationToUser(notificationManager).subscribe(
      data=>{
        
      },
      err=>
      {
      }
    )
  }
        

}

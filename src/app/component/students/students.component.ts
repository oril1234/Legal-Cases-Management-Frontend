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
              this.supervisorName=item.firstName+" "+item.lastname;
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
          this.supervisorName=this.supervisors[0].firstName+" "+this.supervisors[0].lastname;
          this.supervisorId=this.supervisors[0].id;

        }
      else if(this.currentRole==Roles.SUPERADMIN){
        this.dashboardService.getAllClinic().subscribe(
          data=>{
            data=data.filter(clinic=>clinic.clinicName==this.currentClinic);
            this.currentClinic=data[0].clinicName;
            this.supervisors=this.supervisors.filter(supervisor=>supervisor.id==data[0].clinicalSupervisorId)
            this.supervisorName=this.supervisors[0].firstName+" "+this.supervisors[0].lastname;
            this.supervisorId=this.supervisors[0].id;

          }
        )



      }  

    });
  }

  //Modal methodd
  open(content: string, student: Student) {
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

  openDeleteModal(firstName: string, lastName: string, id: string) {}
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
    if (this.addedStudent.id == 0) {
      alert("מספר זהות לא תקין!");
      return false;
    }
    if (this.addedStudent.firstName == "") {
      alert("שם פרטי לא תקין!");
      return false;
    }
    if (this.addedStudent.lastname == "") {
      alert("שם משפחה לא תקין");
      return false;
    }
    if (
      this.addedStudent.email == "" ||
      !this.validateEmail(this.addedStudent.email)
    ) {
      return false;
    }


    let detected: boolean = false;
    this.dashboardService.getAllSupervisors().subscribe((data) => {
      data.forEach((supervisor) => 
      {
        if 
        (
          supervisor.firstName + " " + supervisor.lastname ==
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
            
          }
        );
      }
    });
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
    this.edittedStudent=student
    if (this.edittedStudent.id == 0) {
      alert("מספר זהות לא תקין!");
      return false;
    }
    if (this.edittedStudent.firstName == "") {
      alert("שם פרטי לא תקין!");
      return false;
    }
    if (this.edittedStudent.lastname == "") {
      alert("שם משפחה לא תקין");
      return false;
    }
    if (
      this.edittedStudent.email == "" ||
      !this.validateEmail(this.addedStudent.email)
    ) {
      return false;
    }


    let detected: boolean = false;
    this.dashboardService.getAllSupervisors().subscribe((data) => {
      data.forEach((supervisor) => {
        if (
          supervisor.firstName + " " + supervisor.lastname ==
          this.supervisorName
        ) {
          this.edittedStudent.clinicalSupervisorId = supervisor.id;
          detected = true;
        }
      });
      if (detected) {
        this.dashboardService.editStudent(this.edittedStudent).subscribe((data) => {
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
        n.details=this.person.firstName+" "+this.person.lastname+" הוסיף סטודנט חדש לקליניקה שלך";
      }
      if(type==NotificationType.EDIT)
      {
        n.details=this.person.firstName+" "+this.person.lastname+" ערך פרטים של סטודנט בקליניקה שלך";
      }
      if(type==NotificationType.DELETE)
      {
        n.details=this.person.firstName+" "+this.person.lastname+" מחק סטודנט מהקליניקה מהקליניקה שלך";
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

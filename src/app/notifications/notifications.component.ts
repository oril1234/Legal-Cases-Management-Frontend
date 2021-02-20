import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import jwt_decode from "jwt-decode";
import { NotificationsService } from '../services/notifications.service';
import { NotificationManager } from '../_models/notification-manager';
import { NotificationtsToUsers } from '../_models/notification';
import { Router } from '@angular/router';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
})

//Component to display all notification details of connected user
export class NotificationsComponent implements OnInit {

//All notifications in system
userNotifications:NotificationtsToUsers[]=[];

//All references to notifications
notificationManagerObjects:NotificationManager[]=[]

//Id of connected user
userId = parseInt(
    JSON.parse(
      JSON.stringify(
        jwt_decode(localStorage.getItem("authenticationToken") + "")
      )
    ).sub);

constructor(private httpService: HttpService,private notificationsService: NotificationsService,
    private router:Router) {
    this.getNotifications();
    this.getNotificationManagerObjects();
   }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }


  getNotifications()
  {
   
    this.httpService.getNotificationsByPersonID(this.userId).subscribe(
      data=>{
        this.userNotifications=data;
        this.userNotifications=this.userNotifications.sort((n1,n2) => {
          if (n1.dateTime > n2.dateTime) {
              return -1;
          }
      
          if (n1.dateTime < n2.dateTime) {
              return 1;
          }
      
          return 0;
      });
      
      },
      err=>{
      }
    )
  }

  getNotificationManagerObjects()
  {
    this.httpService.getNotificationManagerObjects().subscribe(
      data=>{
        //alert("The length of data is "+data.length)
        this.notificationManagerObjects=data;
      },
      err=>{
      }
    )
  }


  readNotifications()
  {
    this.notificationsService.changeState(false)
    this.httpService.readAllNotificationsOfPerson(this.userId).subscribe(
      data=>{
        
      },
      err=>{
      }
    )
  }

  deleteNotification(id:string)
  {
    let tmpNManager:NotificationManager[]=this.notificationManagerObjects;
    //alert("The length is "+tmpNManager.length)
    tmpNManager=tmpNManager.filter(nManager=>nManager.notificationId==id);
    let currentLength:number=tmpNManager.length;
    
    this.httpService.deleteNotificationManagerByIdAndReceiverId(id,this.userId).subscribe(
      data=>{
        
        this.notificationManagerObjects=this.notificationManagerObjects.filter(nManager=>nManager.notificationId!=id);
        this.userNotifications=this.userNotifications.filter(n=>n.id!=id);
        if(currentLength<=1)
        {
          alert("WE ARE GOING TO DELETE! The length is "+currentLength)
          this.httpService.deleteNotificationById(id).subscribe(
            data1=>{
              alert("DELETE!!!")
            },
            err=>
            {
              alert("Not deleted!!!")
            }
          )
        }
        else
        alert("NO DELETE! The length is "+tmpNManager.length)

      },
      err=>{
        alert("NO DELETE!!!!")
      }
    )
  }

}

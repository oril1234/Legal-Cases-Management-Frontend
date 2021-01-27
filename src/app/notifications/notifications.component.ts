import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import jwt_decode from "jwt-decode";
import { NotificationsService } from '../services/notifications.service';
import { NotificationManager } from '../_models/notification-manager';
import { NotificationtsToUsers } from '../_models/notification';
import { Router } from '@angular/router';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  userNotifications:NotificationtsToUsers[]=[];
  notificationManagerObjects:NotificationManager[]=[]
 userId = parseInt(
    JSON.parse(
      JSON.stringify(
        jwt_decode(localStorage.getItem("authenticationToken") + "")
      )
    ).sub);

  constructor(private dashBoardService: DashboardService,private notificationsService: NotificationsService,
    private router:Router) {
    this.getNotifications();
    this.getNotificationManagerObjects();
   }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }


  getNotifications()
  {
   
    this.dashBoardService.getNotificationsByPersonID(this.userId).subscribe(
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
    this.dashBoardService.getNotificationManagerObjects().subscribe(
      data=>{
        this.notificationManagerObjects=data;
      }
    )
  }


  readNotifications()
  {
    this.notificationsService.changeState(false)
    this.dashBoardService.readAllNotificationsOfPerson(this.userId).subscribe(
      data=>{
        
      },
      err=>{
      }
    )
  }

  deleteNotification(id:string)
  {
    let tmpNManager:NotificationManager[]=this.notificationManagerObjects;
    alert("The length is "+tmpNManager.length)
    tmpNManager=tmpNManager.filter(nManager=>nManager.notificationId==id);
    let currentLength:number=tmpNManager.length;
    
    /*
    this.dashBoardService.deleteNotificationManagerByIdAndReceiverId(id,this.userId).subscribe(
      data=>{
        
        this.notificationManagerObjects=this.notificationManagerObjects.filter(nManager=>nManager.notificationId!=id);
        this.userNotifications=this.userNotifications.filter(n=>n.id!=id);
        if(currentLength<=1)
        {
          alert("WE ARE GOING TO DELETE! The length is "+currentLength)
          this.dashBoardService.deleteNotificationById(id).subscribe(
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
    */
  }

}

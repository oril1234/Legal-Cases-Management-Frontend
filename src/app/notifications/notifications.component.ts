import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import jwt_decode from "jwt-decode";
import { NotificationsService } from '../services/notifications.service';
import { NotificationManager } from '../_models/notification-manager';
import { NotificationtsToUsers } from '../_models/notification';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  notifications:NotificationtsToUsers[]=[]
 userId = parseInt(
    JSON.parse(
      JSON.stringify(
        jwt_decode(localStorage.getItem("authenticationToken") + "")
      )
    ).sub);

  constructor(private dashBoardService: DashboardService,private notificationsService: NotificationsService) {
    this.getNotifications();
   }

  ngOnInit(): void {
    
  }

  getNotifications()
  {
    let id=JSON.parse(JSON.stringify(jwt_decode(localStorage.getItem("authenticationToken")+""))).sub;

    this.dashBoardService.getNotificationsByPersonID(id).subscribe(
      data=>{
        this.notifications=data;

      },
      err=>{
      }
    )
  }


  readNotifications()
  {
    let id=JSON.parse(JSON.stringify(jwt_decode(localStorage.getItem("authenticationToken")+""))).sub;
    this.dashBoardService.readAllNotificationsOfPerson(id).subscribe(
      data=>{
        this.notificationsService.changeState(false)
      },
      err=>{
      }
    )
  }

  deleteNotification(index:number)
  {
    let nm:NotificationManager=new NotificationManager()
    nm.unread=false;
    nm.receiverId=this.userId;
    nm.notificationId=this.notifications[index].id;
    this.dashBoardService.deleteNotificationForUser(nm).subscribe(
      data=>{
        this.notifications=this.notifications.filter(n=>n.id!=nm.notificationId || nm.receiverId!=this.userId)
      }
    )
  }

}

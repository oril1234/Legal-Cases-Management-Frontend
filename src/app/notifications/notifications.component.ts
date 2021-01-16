import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import jwt_decode from "jwt-decode";
import { NotificationsService } from '../services/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  notifications:Notification[]=[]
  userId=""

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
        alert("error")
      }
    )
  }

}

import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  notifications:Notification[]=[]

  constructor(private dashBoardService: DashboardService) {
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

}

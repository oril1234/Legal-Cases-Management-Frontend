import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {


  private notificationsState = new BehaviorSubject<boolean>(true);
  shouldShowNotifications = this.notificationsState.asObservable();
  
  changeState(updatedValue:boolean){
    this.notificationsState.next(updatedValue); 
  }

  constructor() { }
}

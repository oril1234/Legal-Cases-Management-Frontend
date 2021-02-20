
/**
 * Class of reference of a notification to a specific person
 */
export class NotificationManager {

    //Id of refered notification
    notificationId:string;

    //The id of person to whom reference will be addressed
    receiverId:number;

    //True if notification has not been read yet
    unread:boolean;
}

/**
 * This class is used for a convinient display of a legal case assignment details to a student by specific clinical
 * supervisor as long is the connected user is a clinical supervisor
 */

export class CaseAssignedSupervisorsList {
    id:number;
    studentName:string;
    dateAssigned:Date;
    status:string;
    subject:string;
    taskDescription: string;
    dueDate:Date;
}

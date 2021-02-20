/**
 * Class of an assignment of a case to a student
 */
export class AssignedCase {

    //Id of the assigned legal case
    legalCaseId:number;

    //Id of student to which the legal case is assigned
    studentId:number

    //Date of assignment
    dateAssigned:Date;

    //Description of the task the studnet is required to accomplish in assignment of case
    taskDescription: string;

    //Due date of task completion
    dueDate:Date;


}


/**
 * Class of student
 */
export class Student {

    //Id number of student
    id: number;


    password: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber:string;
    role: string;

    //Id of clinical supervisor of clinic to which the student belongs
    clinicalSupervisorId:number;

    //Url of profile image of student
    imgUrl:string
    
    constructor(init?:Partial<Student>) {
        Object.assign(this, init);
       
    }
}

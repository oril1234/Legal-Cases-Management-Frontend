export class Student {
    id: number;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber:string;
    role: string;
    clinicalSupervisorId:number;
    imgUrl:string
    
    

    constructor(init?:Partial<Student>) {
        Object.assign(this, init);
       
    }
}

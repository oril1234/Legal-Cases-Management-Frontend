export class Student {
    id: number;
    password: string;
    firstName: string;
    lastname: string;
    email: string;
    phoneNumber:string;
    role: string;
    clinicalSupervisorId:number;
    
    

    constructor(init?:Partial<Student>) {
        Object.assign(this, init);
       
    }
}

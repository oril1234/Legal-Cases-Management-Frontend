export class Student {
    id!: string;
    firstName!: string;
    lastname!: string;
    password!:string;
    email!: string;
    phoneNumber!: string;
    clinicalSupervisorName!: string;
    

    constructor(init?:Partial<Student>) {
        Object.assign(this, init);
       
    }
}

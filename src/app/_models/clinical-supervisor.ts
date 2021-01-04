export class ClinicalSupervisor {
    id!: number;
    firstName!: string;
    password!:string;
    email!: string;
    phoneNumber!: string;
    lastname!: string;
    role!:string;
    sinceYear!:number

    constructor(init?:Partial<ClinicalSupervisor>) {
        Object.assign(this, init);
       
    }

    
}

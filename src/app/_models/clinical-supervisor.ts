export class ClinicalSupervisor {
    id!: number;
    firstName!: string;
    password!:string;
    email!: string;
    phoneNumber!: string;
    lastName!: string;
    role!:string;
    sinceYear!:number;
    imgUrl:string

    constructor(init?:Partial<ClinicalSupervisor>) {
        Object.assign(this, init);
       
    }

    
}

export class ClinicalSupervisor {
    id!: string;
    firstName!: string;
    email!: string;
    phoneNumber!: string;
    clinicalSupervisorId!: string;
    lastname!: string;
    sinceYear!:number

    constructor(init?:Partial<ClinicalSupervisor>) {
        Object.assign(this, init);
       
    }

    
}

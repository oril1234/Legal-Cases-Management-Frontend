/**
 * Class of clinical supervisor
 */

export class ClinicalSupervisor {
    id!: number;
    firstName!: string;
    password!:string;
    email!: string;
    phoneNumber!: string;
    lastName!: string;
    role!:string;

    //The year the clinical supervisor started his job
    sinceYear!:number;

    //Url of profile image of clinical supervisor
    imgUrl:string

    constructor(init?:Partial<ClinicalSupervisor>) {
        Object.assign(this, init);
       
    }

    
}

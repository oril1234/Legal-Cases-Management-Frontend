/**
 * Class of legal case
 */

export class LegalCase {
    //Number of legal case
    id: number;

    //Date of creation of legal case
    dateAdded: Date;

    //The subject of the legal case
    subject: string;

    //The current ststus of the legal case
    status: string;

    //The number of this legal case in court in a case its handled there
    courtCaseId: number;

    // The name of the clinic in which the legal case was opened
    clinicName: string;

    //The id of client for whom the case was created
    clientId:number;

    //The type of the legal case
    caseType:string
}

import { Injectable } from '@angular/core';
import {  HttpParams, HttpClient } from '@angular/common/http';
import {Student }from './_models/student'
import { ClinicalSupervisor } from './_models/clinical-supervisor';
import { LegalCase } from './_models/legal-case';
import { Clinic } from './_models/clinic';
import { LegalCaseCounter } from './_models/legal-case-counter';
import {BetweenDates} from './_models/between-dates';
import { Client } from './_models/client';
import { Research } from './_models/research';
import { NotificationtsToUsers } from './_models/notification';
import { NotificationManager } from './_models/notification-manager';
import { environment } from "../environments/environment";
import {AssignedCase} from './_models/assigned-case'
import { CaseAssignedSupervisorsList } from './_models/case-assigned-supervisors-list';
import { Person } from './_models/person';
import { LegislativeProposal } from './_models/legislative-proposal';
import { PolicyPaper } from './_models/policy-paper';

let BASE_URL:string = "http://localhost:9090";


if (environment.production) {
  // Amazon AWS Backend
  BASE_URL = "http://oglegal.us-east-1.elasticbeanstalk.com"
}


NotificationManager

@Injectable({
  providedIn: 'root'
})

//This is a service class for http calls 
export class HttpService {

  constructor(private http:HttpClient) { }

  
  //Get number of cases that were closed in the passed year
  getNumberOfClosedCasesPassedYear(){
    let myUrl=BASE_URL + "/api/v1/legalcase/closedCases"
    return this.http.get<number>(`${myUrl}`); 

  }

  //Get number of cases that were received last year
  numberOfCasesReceivedThisPastYear()
  {
    let myUrl=BASE_URL + "/api/v1/legalcase/total";
    return this.http.get<number>(`${myUrl}`);
  }

  //Get number of cases that were received last year for a pecific clinic
numberOfCasesReceivedThisPastYearByClinic(clinicName: string)
{
  let myUrl=BASE_URL + `/api/v1/legalcase/total/clinic/${clinicName}`;
  return this.http.get<number>(`${myUrl}`);

}

//Number of cases that were handled by court in all clinics in a range of dates
numberOfCasesToCourtInAllClinicsBetween2Dates(range: BetweenDates)
{
  return this.http.post<number>(BASE_URL + "/api/v1/legalcase/casesBetween",range);
}

//Number of cases that were handled by court in a specific clinic in a range of dates
numberOfCasesToCourtInChosenClinicBetween2Dates(clinicName: string, range: BetweenDates)
{
  let myUrl=BASE_URL + `/api/v1/legalcase/casesBetween/${clinicName}`;
  return this.http.post<number>(`${myUrl}`,range);
}


getAllPersons()
{
  
  let myUrl=BASE_URL + "/api/v1/person"
  return this.http.get<Person[]>(`${myUrl}`); 

}


getPersonById(id:number)
{
  let myUrl=BASE_URL +`/api/v1/person/${id}`
  return this.http.get<Person>(`${myUrl}`); 
}

editPerson(person:Person)
{
  let myUrl=BASE_URL +`/api/v1/person/${person.id}`
  return this.http.put<any>(`${myUrl}`,person); 
}


  getAllStudents()
  {
    let myUrl=BASE_URL + "/api/v1/student"
    return this.http.get<Student[]>(`${myUrl}`); 

  }

  //Get the full name of a person according to his id
  getPersonFullNameById(id:number)
  {
    let myUrl=BASE_URL + `/api/v1/person/fullName/${id}`
    return this.http.get<string[]>(`${myUrl}`); 

  }

  //Get all students that belong to a specific clinic
  getAllStudentsInMyClinic(id:number)
  {
    let myUrl=BASE_URL + `/api/v1/student/clinic/${id}/getall`
    return this.http.get<Student[]>(`${myUrl}`); 

  }

  //Get total number of students in the system
  getStudentsNum()
  {
    let myUrl=BASE_URL + "/api/v1/student/total";
    return this.http.get<number>(`${myUrl}`); 
  }

  //For getting supervisors' details according to student id
  getStudentsClinicalSupervisorDetails(id:number)
  {
    let myUrl=BASE_URL + `/api/v1/student/${id}/supervisor`;
    return this.http.get<ClinicalSupervisor>(`${myUrl}`); 
    
  }
  
  //Get all the students that are in a specific clinic
  getAllStudentsInChosenClinic(clinicName:string)
  {
    let myUrl=BASE_URL + `/api/v1/student/clinic/getAllClinicsStudents"`;
    return this.http.post<Student[]>(`${myUrl}`,clinicName); 
  }
  
  //Number of students in a specific clinic
  getNumberOfStudentsInAChosenClinic(clinicName:string)
  {

    let myUrl=BASE_URL + `/api/v1/student/clinic/totalNumberOfStudents`;
    return this.http.post<number>(`${myUrl}`,clinicName); 
  }        
  

  getStudentById(id:number)
  {
    let myUrl=BASE_URL + `/api/v1/student/${id}`
    return this.http.get<Student>(`${myUrl}`); 

  }

  addNewStudent(student:Student)
  {

    let myUrl=BASE_URL + "/api/v1/student"
    return this.http.post(`${myUrl}`,student); 

  }

  //Delete a stuudent according to his id
  deleteStudent(id:number)
  {
    let myUrl=BASE_URL + `/api/v1/student/${id}`  
    return this.http.delete<ClinicalSupervisor[]>(`${myUrl}`); 

  }


  editStudent(student:Student)
  {
    let myUrl=BASE_URL + `/api/v1/student/${student.id}`
    return this.http.put<any>(`${myUrl}`,student); 

  }

  //Get all clinical supervisors
  getAllSupervisors()
  {
    let myUrl=BASE_URL + "/api/v1/clinicalSupervisor"
    return this.http.get<ClinicalSupervisor[]>(`${myUrl}`); 

  }


  getClinicalSupervisorById(id:number)
  {
    let myUrl=BASE_URL +`/api/v1/clinicalSupervisor/${id}`;
    return this.http.get<ClinicalSupervisor>(`${myUrl}`); 
  }

  addNewSupervisor(supervisor:ClinicalSupervisor)
  {
    let myUrl=BASE_URL + "/api/v1/clinicalSupervisor"
    return this.http.post<any>(`${myUrl}`,supervisor); 

  }

  deleteSupervisor(id:number)
  {
    let myUrl=BASE_URL + `/api/v1/clinicalSupervisor/${id}`
    return this.http.delete<any>(`${myUrl}`); 
  }

  editSupervisor(supervisor:ClinicalSupervisor)
  {
    let myUrl=BASE_URL + `/api/v1/clinicalSupervisor/${supervisor.id}`
    return this.http.put<any>(`${myUrl}`,supervisor); 
  }

  //Get all legal cases
  getAllCases()
  {
    let myUrl=BASE_URL + "/api/v1/legalcase"
    return this.http.get<LegalCase[]>(`${myUrl}`); 

  }

  //Get a specific legal case according to its id number
  getCaseById(id:number)
  {
    
    let myUrl=BASE_URL + `/api/v1/legalcase/${id}`
    return this.http.get<LegalCase>(`${myUrl}`); 

  }

  //Add a new legal case
  addNewCase(legalcase:LegalCase)
  {
    let myUrl=BASE_URL + "/api/v1/legalcase"
    return this.http.post<any>(`${myUrl}`,legalcase); 

  }

  //Generate random number for a legal case
  getLegalCaseGeneratedId()
  {
    let myUrl=BASE_URL + "/api/v1/legalcase/generateId"
    return this.http.get<number>(`${myUrl}`); 

  }


  deleteCase(id:number)
  {
    let myUrl=BASE_URL + `/api/v1/legalcase/${id}`
    return this.http.delete<any>(`${myUrl}`); 
  }

  editCase(legalCase:LegalCase)
  {
    let myUrl=BASE_URL + `/api/v1/legalcase/${legalCase.id}`
    return this.http.put(`${myUrl}`,legalCase); 
  }

  //Get all cases that were assigned to students
  getAllAssignedCases()
  {
    let myUrl=BASE_URL + `/api/v1/caseAssigned`
    return this.http.get<AssignedCase[]>(`${myUrl}`); 

  }

  //Get details of all cases assigned by a clinical supervisor according to his id number
  getAllAssignedCasesBySupervisor(id:number)
  {
    let myUrl=BASE_URL + `/api/v1/caseAssigned/allCasesAssigedToStudents/${id}`
    return this.http.get<CaseAssignedSupervisorsList[]>(`${myUrl}`); 

  }

  //Add assignment of a legal case to a student
  addNewCaseAssignment(assignedCase:AssignedCase)
  {
    let myUrl=BASE_URL + "/api/v1/caseAssigned"
    return this.http.post<any>(`${myUrl}`,assignedCase); 

  }

  //Casncel assignment of a legal case to a student according to his id number and case number
  deleteCaseAssignmentByStudentIdAndCase(studentId:number,caseId:number)
  {
    
    let myUrl=BASE_URL +`/api/v1/caseAssigned/case/${caseId}/student/${studentId}`
    return this.http.delete<any>(`${myUrl}`); 
  }


  //Get all legislative proposals
  getAllProposal()
  {
    let myUrl=BASE_URL + "/api/v1/legProposal"
    return this.http.get<LegislativeProposal[]>(`${myUrl}`); 

  }

  //Add new legislative proposal
  addNewProposal(proposal:LegislativeProposal)
  {
    let myUrl=BASE_URL + `/api/v1/legProposal`
    return this.http.post<LegislativeProposal[]>(`${myUrl}`,proposal); 

  }

  deleteProposal(id:number)
  {
    let myUrl=BASE_URL + `/api/v1/legProposal/${id}`
    return this.http.delete<any>(`${myUrl}`); 

  }

  editProposal(proposal:LegislativeProposal)
  {
    let myUrl=BASE_URL + `/api/v1/legProposal/${proposal.id}`
    return this.http.put(`${myUrl}`,proposal); 
  }

  getAllResearches()
  {
    let myUrl=BASE_URL + "/api/v1/research"
    return this.http.get<Research[]>(`${myUrl}`); 

  }

  addNewResearch(research:Research)
  {
    let myUrl=BASE_URL + "/api/v1/research"
    return this.http.post<any>(`${myUrl}`,research); 

  }

  editResearch(research:Research)
  {
    let myUrl=BASE_URL + `/api/v1/research/${research.id}`
    return this.http.put<any>(`${myUrl}`,research); 
  }

  deleteResearch(id:number)
  {
    let myUrl=BASE_URL + `/api/v1/research/${id}`
    return this.http.delete<any>(`${myUrl}`);  
  }

  getAllPolicyPapers()
  {
    let myUrl=BASE_URL + "/api/v1/policyPaper"
    return this.http.get<PolicyPaper[]>(`${myUrl}`); 

  }

  addNewPolicyPaper(policyPaper:PolicyPaper)
  {
    let myUrl=BASE_URL + "/api/v1/policyPaper"
    return this.http.post<any>(`${myUrl}`,policyPaper) 

  }

  editPolicyPaper(policyPaper:PolicyPaper)
  {
    let myUrl=BASE_URL + `/api/v1/policyPaper/${policyPaper.id}`
    return this.http.put<any>(`${myUrl}`,policyPaper); 
  }

  deletePolicyPaper(id:number)
  {
    let myUrl=BASE_URL + `/api/v1/policyPaper/${id}`
    return this.http.delete<any>(`${myUrl}`); 
  }

  //Get all clinics
  getAllClinic()
  {
    let myUrl=BASE_URL + "/api/v1/clinic"
    return this.http.get<Clinic[]>(`${myUrl}`); 

  }

  //Get the clinical supervisor of student according to student id number
  getClinicalSupervisorByStudentId(id:number)
  {
    
    let myUrl=BASE_URL + `/api/v1/student/${id}/supervisor`
    return this.http.get<ClinicalSupervisor>(`${myUrl}`); 


  }

  getStudentClinicalSupervisorByStudentId(id:number)
  {
    let myUrl=BASE_URL + `/api/v1/student/${id}/supervisor`
    return this.http.get<ClinicalSupervisor>(`${myUrl}`); 

  }

  //Get the name of clinic of clinical supervisor according to his id
  getClinicNameBySupervisorId(id:number)
  {
    let myUrl=BASE_URL + `/api/v1/clinic/name/${id}`
    return this.http.get<string[]>(`${myUrl}`); 

  }

  addNewClinic(clinic:Clinic)
  {
    let myUrl=BASE_URL + "/api/v1/clinic"
    return this.http.post(`${myUrl}`,clinic); 

  }

  updateClinicDetails(clinic:Clinic)
  {

    let myUrl=BASE_URL +`/api/v1/clinic/${clinic.clinicName}`
    return this.http.put(`${myUrl}`,clinic); 

  }
    
  confirmFileUpload(file_path:string)
  {
    let myUrl=BASE_URL + "/api/v1/import/confirm-upload"
    return this.http.get(`${myUrl}`); 
  }

  deleteClinic(clinicName:string)
  {
    let myUrl=BASE_URL + `/api/v1/clinic/${clinicName}`
    return this.http.delete<Clinic[]>(`${myUrl}`); 
  }

  editClinic(clinic:Clinic)
  {
    let myUrl=BASE_URL + `/api/v1/clinic/${clinic.clinicName}`
    return this.http.put<any>(`${myUrl}`,clinic); 

  }

  //Get number of legal cases received to a specific clinic
  getNumberOfCasesByClinicName(clinicName:string)
  {
    
    let myUrl=BASE_URL + "/api/v1/legalcase/clinic";
    return this.http.get<number>(`${myUrl}/${clinicName}`); 

  }

  //////////////////////clinics///////////////////////////////////

  //Get number of all the active clinics
getNumberOfActiveClinics()
{
  let myUrl=BASE_URL + "/api/v1/clinic/total/active";
  return this.http.get<number>(`${myUrl}`); 

}       

//Get all the inactive clinics
getAllInactiveClinicsList()
{
  let myUrl=BASE_URL + "/api/v1/clinic/inactive";
  return this.http.get<Clinic[]>(`${myUrl}`); 
}


/*In clinical supervisor dashboard- get students name in
  a clinic and number of cases assigned to them
*/ 
getNumberOfCasesPerStudentBySupervisorId(id:number)
{
  let myUrl=BASE_URL + `/api/v1/clinic/${id}/legalCasesPerStudent`;
  return this.http.get<LegalCaseCounter[]>(`${myUrl}`);
}

//All cases assigned to student
getAllCasesAssignedToStudennt(id:number)
{
  let myUrl=BASE_URL + `/api/v1/caseAssigned/student/${id}`;
  return this.http.get<LegalCase[]>(`${myUrl}`);

}

//Get total number of legal cases assigned to student
getNumberOfCasesAssignedToStudent(id:number)
{
  let myUrl=BASE_URL + `/api/v1/caseAssigned/total/student/${id}`;
  return this.http.get<number>(`${myUrl}`);

}

//get number of legal cases in a specific clinic
getNumberOfCasesByChosenClinic(clinicName:string)
{
  let myUrl=BASE_URL + `/api/v1/legalcase/clinic/${clinicName}`;
  return this.http.get<number>(`${myUrl}`);
}

//Get all legal cases that are currently handled by court
selectAllLegalCasesInCourt()
{
  let myUrl=BASE_URL + `/api/v1/legalcase/allInCourt`;
  return this.http.get<LegalCase[]>(`${myUrl}`);
}

//Get all legal cases that are currently handled by court from specific clinic
selectAllLegalCasesInCourtBelongingToClinic(clinicName:string)
{
  let myUrl=BASE_URL + `/api/v1/legalcase/allInCourt/${clinicName}`;
  return this.http.get<LegalCase[]>(`${myUrl}`);
}

//Get all legal cases that are currently not handled by court
selectAllLegalCasesNotInCourt()
{
  let myUrl=BASE_URL + `/api/v1/legalcase/notInCourt`;
  return this.http.get<LegalCase[]>(`${myUrl}`);

}

//Get all legal cases that are currently not handled by court from specific clinic
selectAllLegalCasesNotInCourtBelongingToClinic(clinicName:string)
{
  let myUrl=BASE_URL + `/api/v1/legalcase/notInCourt/${clinicName}`;
  return this.http.get<LegalCase[]>(`${myUrl}`);

}

//Get total number of clinical supervisors
getNumberOfClinicalSupervisors()
{
  let myUrl=BASE_URL + `/api/v1/clinicalSupervisor/total`;
  return this.http.get<number>(`${myUrl}`);
}


getNumberOfResearchesInAChosenClinic(clinicName:string)
{
  let myUrl=BASE_URL + `/api/v1/research/clinic/total/${clinicName}`;
  return this.http.get<number>(`${myUrl}`);
}


///////////////////////Notifications////////////////////////


//Get total number notification addressed to specific person
getNotificationsNumberByPersonID(id:number)
{
  let myUrl=BASE_URL + `/api/v1/notificationManager/total/${id}`;
  return this.http.get<number>(`${myUrl}`);

}

//Get all notifications in system
getAllNotifications()
{
  let myUrl=BASE_URL + `/api/v1/notificationManager`;
  return this.http.get<NotificationtsToUsers[]>(`${myUrl}`);

}

//Get all notification of a specific person according to his id number
getNotificationsByPersonID(id:number)
{
  let myUrl=BASE_URL + `/api/v1/notificationManager/${id}`;
  return this.http.get<NotificationtsToUsers[]>(`${myUrl}`);

}

//Mark read all notifications of connected user 
readAllNotificationsOfPerson(notificationId:number)
{
  let myUrl=BASE_URL + `/api/v1/notificationManager/markAsRead`;
  return this.http.put<number>(`${myUrl}`,notificationId+"");
}

//Create new notification
addNotification(notification:NotificationtsToUsers){
  
  let myUrl=BASE_URL + `/api/v1/notification`;
  return this.http.post<string[]>(`${myUrl}`,notification);

}

//Get all the references of notifications to specific persons
getNotificationManagerObjects()
{
  let myUrl=BASE_URL + `/api/v1/notificationManager/all`;
  return this.http.get<NotificationManager[]>(`${myUrl}`);
}

//create a reference of a notification to a specific person
mapNotificationToUser(notifictionManager:NotificationManager)
{
  let myUrl=BASE_URL + `/api/v1/notificationManager`;
  return this.http.post(`${myUrl}`,notifictionManager);

}

//Delete a reference of a notificationfor specific person
deleteNotificationManagerByIdAndReceiverId(notificationId:string,userId:number)
{
  let myUrl=BASE_URL + `/api/v1/notificationManager/${notificationId}/${userId}`;
  return this.http.delete(`${myUrl}`);
}

//Using id of notification in order to delete it
deleteNotificationById(id:string)
{
  let myUrl=BASE_URL + `/api/v1/notification/${id}`;
  return this.http.delete(`${myUrl}`);

}


/////////////////End Notifications///////////////////////////

//Get all clients for whom cases were created
getAllClients()
{
  let myUrl=BASE_URL + `/api/v1/client`;
  return this.http.get<Client[]>(`${myUrl}`);

}


getClientById(id:number)
{
  let myUrl=BASE_URL + `/api/v1/client/${id}`;
  return this.http.get<Client>(`${myUrl}`);

}

addNewClient(client:Client)
{
  let myUrl=BASE_URL + `/api/v1/client`;
  return this.http.post<any>(`${myUrl}`,client);

}



}
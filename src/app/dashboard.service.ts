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

let BASE_URL:string = "http://localhost:9090";


if (environment.production) {
  // Amazon AWS Backend
  BASE_URL = "http://tmp:9090/"
}


NotificationManager

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http:HttpClient) { }

  getNumberOfClosedCasesPassedYear(){
    let myUrl=BASE_URL + "/api/v1/legalcase/closedCases"
    return this.http.get<number>(`${myUrl}`); 

  }

  numberOfCasesReceivedThisPastYear()
  {
    let myUrl=BASE_URL + "/api/v1/legalcase/total";
    return this.http.get<number>(`${myUrl}`);
  }

numberOfCasesReceivedThisPastYearByClinic(clinicName: string)
{
  let myUrl=BASE_URL + `/api/v1/legalcase/total/clinic/${clinicName}`;
  return this.http.get<number>(`${myUrl}`);

}

//in superadmin dashboard- The number of cases between 2 dates in all the clinic
//TODO:
 

numberOfCasesToCourtInAllClinicsBetween2Dates(range: BetweenDates)
{


  return this.http.post<number>(BASE_URL + "/api/v1/legalcase/casesBetween",range);
}


numberOfCasesToCourtInChosenClinicBetween2Dates(clinicName: string, range: BetweenDates)
{
  let myUrl=BASE_URL + `/api/v1/legalcase/casesBetween/${clinicName}`;
  return this.http.post<number>(`${myUrl}`,range);
}


getAllPersons()
{
  
  let myUrl=BASE_URL + "/api/v1/person"
  return this.http.get<Student[]>(`${myUrl}`); 

}


  getAllStudents()
  {
    let myUrl=BASE_URL + "/api/v1/student"
    return this.http.get<Student[]>(`${myUrl}`); 

  }

  getPersonFullNameById(id:number)
  {
    let myUrl=BASE_URL + `/api/v1/person/fullName/${id}`
    return this.http.get<string[]>(`${myUrl}`); 

  }

  getAllStudentsInMyClinic(id:number)
  {
    let myUrl=BASE_URL + `/api/v1/student/clinic/${id}/getall`
    return this.http.get<Student[]>(`${myUrl}`); 

  }

  getNumberOfStudentsInMyClinic()
  {

  }

  getStudentsNum()
  {
    let myUrl=BASE_URL + "/api/v1/student/total";
    return this.http.get<number>(`${myUrl}`); 
  }

  //For getting supervisors' details according to student id
  getStudentsClinicalSupervisorDetails(id:number)
  {
    let myUrl=BASE_URL + "/api/v1/student/{id}/supervisor";
    return this.http.get<number>(`${myUrl}`); 
    
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
  
  

  addNewStudent(student:Student)
  {

    let myUrl=BASE_URL + "/api/v1/student"
    return this.http.post(`${myUrl}`,student); 

  }

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



  getAllCases()
  {
    let myUrl=BASE_URL + "/api/v1/legalcase"
    return this.http.get<LegalCase[]>(`${myUrl}`); 

  }

  addNewCase(legalcase:LegalCase)
  {
    let myUrl=BASE_URL + "/api/v1/legalcase"
    return this.http.post<any>(`${myUrl}`,legalcase); 

  }
  deleteCase(id:number)
  {
    let myUrl=BASE_URL + `/api/v1/legalcase/${id}`
    return this.http.delete<any>(`${myUrl}`); 
  }

  editCase(legalCase:LegalCase)
  {
    let myUrl=BASE_URL + `/api/v1/legalcase/${legalCase.id}`
    return this.http.put<any>(`${myUrl}`,legalCase); 
  }
  getAllAssignedCasesBySupervisor(id:number)
  {
    let myUrl=BASE_URL + `/api/v1/caseAssigned/allCasesAssigedToStudents/${id}`
    return this.http.get<CaseAssignedSupervisorsList[]>(`${myUrl}`); 

  }

  addNewCaseAssignment(assignedCase:AssignedCase)
  {
    let myUrl=BASE_URL + "/api/v1/caseAssigned"
    return this.http.post<any>(`${myUrl}`,assignedCase); 

  }

  deleteCaseAssignmentByStudentIdAndCase(studentId:number,caseId:number)
  {
    
    let myUrl=BASE_URL +`/api/v1/caseAssigned/case/${caseId}/student/${studentId}`
    return this.http.delete<any>(`${myUrl}`); 
  }




  getAllClinic()
  {
    let myUrl=BASE_URL + "/api/v1/clinic"
    return this.http.get<Clinic[]>(`${myUrl}`); 

  }

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
    return this.http.put<number>(`${myUrl}`,clinic); 

  }
    
  confirmFileUpload(file_path:string)
  {
    let myUrl=BASE_URL + "/api/v1/import/confirm-upload"
    return this.http.get(`${myUrl}`); 
  }

  deleteClinic(id:number)
  {
    let myUrl=BASE_URL + `/api/v1/clinic/${id}`
    return this.http.delete<Clinic[]>(`${myUrl}`); 
  }

  editClinic(clinic:Clinic)
  {
    let myUrl=BASE_URL + `/api/v1/clinic/${clinic.clinicName}`
    return this.http.put<any>(`${myUrl}`,clinic); 

  }

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

getAllCasesAssignedToStudennt(id:number)
{
  let myUrl=BASE_URL + `/api/v1/caseAssigned/student/${id}`;
  return this.http.get<LegalCase[]>(`${myUrl}`);

}

getNumberOfCasesAssignedToStudent(id:number)
{
  let myUrl=BASE_URL + `/api/v1/caseAssigned/total/student/${id}`;
  return this.http.get<number>(`${myUrl}`);

}


getNumberOfCasesByChosenClinic(clinicName:string)
{
  let myUrl=BASE_URL + `/api/v1/legalcase/clinic/${clinicName}`;
  return this.http.get<number>(`${myUrl}`);
}

selectAllLegalCasesInCourt()
{
  let myUrl=BASE_URL + `/api/v1/legalcase/allInCourt`;
  return this.http.get<LegalCase[]>(`${myUrl}`);
}




selectAllLegalCasesInCourtBelongingToClinic(clinicName:string)
{
  let myUrl=BASE_URL + `/api/v1/legalcase/allInCourt/${clinicName}`;
  return this.http.get<LegalCase[]>(`${myUrl}`);
}

selectAllLegalCasesNotInCourt()
{
  let myUrl=BASE_URL + `/api/v1/legalcase/notInCourt`;
  return this.http.get<LegalCase[]>(`${myUrl}`);

}


selectAllLegalCasesNotInCourtBelongingToClinic(clinicName:string)
{
  let myUrl=BASE_URL + `/api/v1/legalcase/notInCourt/${clinicName}`;
  return this.http.get<LegalCase[]>(`${myUrl}`);

}

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

getNotificationsNumberByPersonID(id:number)
{
  let myUrl=BASE_URL + `/api/v1/notificationManager/total/${id}`;
  return this.http.get<number>(`${myUrl}`);

}

getNotificationsByPersonID(id:number)
{
  let myUrl=BASE_URL + `/api/v1/notificationManager/${id}`;
  return this.http.get<Notification[]>(`${myUrl}`);

}

readAllNotificationsOfPerson(notificationId:number)
{
  let myUrl=BASE_URL + `/api/v1/notificationManager/markAsRead`;
  return this.http.put<number>(`${myUrl}`,notificationId+"");
}

addNotification(notification:NotificationtsToUsers){
  let myUrl=BASE_URL + `/api/v1/notification`;
  return this.http.post<string[]>(`${myUrl}`,notification);


}

mapNotificationToUser(notifictionManager:NotificationManager)
{
  let myUrl=BASE_URL + `/api/v1/notificationManager`;
  return this.http.post(`${myUrl}`,notifictionManager);

}


/////////////////End Notifications///////////////////////////

getClientNyId(id:number)
{
  let myUrl=BASE_URL + `/api/v1/client/${id}`;
  return this.http.get<Client>(`${myUrl}`);

}





/////////////////////////Research///////////////////

getAllResearches()
{
  let myUrl=BASE_URL + `/api/v1/research`;
  return this.http.get<Research[]>(`${myUrl}`);

}
/////////////////////End Research////////////////////

}
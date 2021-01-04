import { Injectable } from '@angular/core';
import {  HttpParams, HttpClient } from '@angular/common/http';
import {Student }from './_models/student'
import { ClinicalSupervisor } from './_models/clinical-supervisor';
import { LegalCase } from './_models/legal-case';
import { Clinic } from './_models/clinic';
import { LegalCaseCounter } from './_models/legal-case-counter';
import { BetweenDates } from './_models/between-dates';



@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http:HttpClient) { }

  getNumberOfClosedCasesPassedYear(){
    let myUrl="http://localhost:9090/api/v1/legalcase/closedCases"
    return this.http.get<number>(`${myUrl}`); 

  }

  numberOfCasesReceivedThisPastYear()
  {
    let myUrl="http://localhost:9090/api/v1/legalcase/total";
    return this.http.get<number>(`${myUrl}`);
  }

numberOfCasesReceivedThisPastYearByClinic(clinicName: string)
{
  let myUrl=`http://localhost:9090/api/v1/legalcase/total/clinic/${clinicName}`;
  return this.http.get<number>(`${myUrl}`);

}

//in superadmin dashboard- The number of cases between 2 dates in all the clinic
//TODO:
numberOfCasesToCourtInAllClinicsBetween2Dates(range: BetweenDates)
{

  let httpParams = new HttpParams();
  httpParams.append("betweenDates",JSON.stringify(range));
  return this.http.get<number>("http://localhost:9090/api/v1/legalcase/casesBetween",{ params: httpParams });
}

/**
 * [19:46, 2.1.2021] גילית: numberOfCasesToCourtInChosenClinicBetween2Dates: api/v1/legalcase/casesBetween/{clinicName}
*/


  getAllStudents()
  {
    let myUrl="http://localhost:9090/api/v1/student"
    return this.http.get<Student[]>(`${myUrl}`); 

  }

  getStudentsNum()
  {
    let myUrl="http://localhost:9090/api/v1/student/total";
    return this.http.get<number>(`${myUrl}`); 
  }

  //For getting supervisors' details according to student id
  getStudentsClinicalSupervisorDetails(id:number)
  {
    let myUrl="api/v1/student/{id}/supervisor";
    return this.http.get<number>(`${myUrl}`); 
    
  }
  
  //Get all the students that are in a specific clinic
  getAllStudentsInChosenClinic(clinicName:string)
  {
    let myUrl=`api/v1/student/clinic/${clinicName}"`;
    return this.http.get<Student[]>(`${myUrl}`); 
  }
  
  //Number of students in a specific clinic
  getNumberOfStudentsInAChosenClinic(clinicName:string)
  {

    let myUrl=`api/v1/student/clinic/total/${clinicName}`;
    return this.http.get<number>(`${myUrl}`); 
  }        
  
  

  addNewStudent(student:Student)
  {
    let myUrl="http://localhost:9090/api/v1/student"
    return this.http.post<Student[]>(`${myUrl}`,student); 

  }

  deleteStudent(id:string)
  {
    let myUrl=`http://localhost:9090/api/v1/student/${id}`  
    return this.http.delete<ClinicalSupervisor[]>(`${myUrl}`); 

  }

  editStudent(student:Student)
  {
    let myUrl=`http://localhost:9090/api/v1/student/${student.id}`
    return this.http.put<any>(`${myUrl}`,student); 

  }




  getAllSupervisors()
  {
    let myUrl="http://localhost:9090/api/v1/clinicalSupervisor"
    return this.http.get<ClinicalSupervisor[]>(`${myUrl}`); 

  }

  addNewSupervisor(supervisor:ClinicalSupervisor)
  {
    let myUrl="http://localhost:9090/api/v1/clinicalSupervisor"
    return this.http.post<any>(`${myUrl}`,supervisor); 

  }

  deleteSupervisor(id:number)
  {
    let myUrl=`http://localhost:9090/api/v1/clinicalSupervisor/${id}`
    return this.http.delete<any>(`${myUrl}`); 
  }

  editSupervisor(supervisor:ClinicalSupervisor)
  {
    let myUrl=`http://localhost:9090/api/v1/clinicalSupervisor/${supervisor.id}`
    return this.http.put<any>(`${myUrl}`,supervisor); 
  }



  getAllCases()
  {
    let myUrl="http://localhost:9090/api/v1/legalcase"
    return this.http.get<LegalCase[]>(`${myUrl}`); 

  }

  addNewCase(legalcase:LegalCase)
  {
    let myUrl="http://localhost:9090/api/v1/legalcase"
    return this.http.post<any>(`${myUrl}`,legalcase); 

  }

  deleteCase(id:number)
  {
    let myUrl=`http://localhost:9090/api/v1/legalcase/${id}`
    return this.http.delete<any>(`${myUrl}`); 
  }

  editCase(legalCase:LegalCase)
  {
    let myUrl=`http://localhost:9090/api/v1/legalcase/${legalCase.id}`
    return this.http.put<any>(`${myUrl}`,legalCase); 
  }


  getAllClinic()
  {
    let myUrl="http://localhost:9090/api/v1/clinic"
    return this.http.get<Clinic[]>(`${myUrl}`); 

  }

  
  addNewClinic(clinic:Clinic)
  {
    let myUrl="http://localhost:9090/api/v1/clinic"
    return this.http.post<Clinic[]>(`${myUrl}`,clinic); 

  }

  deleteClinic(id:number)
  {
    let myUrl=`http://localhost:9090/api/v1/clinic/${id}`
    return this.http.delete<Clinic[]>(`${myUrl}`); 
  }

  editClinic(clinic:Clinic)
  {
    let myUrl=`http://localhost:9090/api/v1/clinic/${clinic.clinicName}`
    return this.http.put<any>(`${myUrl}`,clinic); 

  }

  getNumberOfCasesByClinicName(clinicName:string)
  {
    
    let myUrl="http://localhost:9090/api/v1/legalcase/clinic";
    return this.http.get<number>(`${myUrl}/${clinicName}`); 

  }

  //////////////////////clinics///////////////////////////////////

  //Get number of all the active clinics
getNumberOfActiveClinics()
{
  let myUrl="http://localhost:9090/api/v1/clinic/total/active";
  return this.http.get<number>(`${myUrl}`); 

}       

//Get all the inactive clinics
getAllInactiveClinicsList()
{
  let myUrl="http://localhost:9090/api/v1/clinic/inactive";
  return this.http.get<Clinic[]>(`${myUrl}`); 
}


/*In clinical supervisor dashboard- get students name in
  a clinic and number of cases assigned to them
*/ 
getNumberOfCasesPerStudentByClinic(clinicName:string)
{
  let myUrl=`http://localhost:9090/api/v1/clinic/${clinicName}/legalCasesPerStudent`;
  return this.http.get<LegalCaseCounter[]>(`${myUrl}`);
} 


getNumberOfCasesByChosenClinic(clinicName:string)
{
  let myUrl=`http://localhost:9090/api/v1/legalcase/clinic/${clinicName}`;
  return this.http.get<number>(`${myUrl}`);
}

selectAllLegalCasesInCourt()
{
  let myUrl=`http://localhost:9090/api/v1/legalcase/clinic/allInCourt`;
  return this.http.get<LegalCase[]>(`${myUrl}`);
}

selectAllLegalCasesInCourtBelongingToClinic(clinicName:string)
{
  let myUrl=`http://localhost:9090/api/v1/legalcase/allInCourt/${clinicName}`;
  return this.http.get<LegalCase[]>(`${myUrl}`);
}

selectAllLegalCasesNotInCourt()
{
  let myUrl=`http://localhost:9090/api/v1/legalcase/notInCourt`;
  return this.http.get<LegalCase[]>(`${myUrl}`);

}


selectAllLegalCasesNotInCourtBelongingToClinic(clinicName:string)
{
  let myUrl=`http://localhost:9090/api/v1/legalcase/notInCourt/${clinicName}`;
  return this.http.get<LegalCase[]>(`${myUrl}`);

}

getNumberOfClinicalSupervisors()
{
  let myUrl=`http://localhost:9090/api/v1/clinicalSupervisor/total`;
  return this.http.get<number>(`${myUrl}`);
}

getNumberOfResearchesInAChosenClinic(clinicName:string)
{
  let myUrl=`http://localhost:9090/api/v1/research/clinic/total/${clinicName}`;
  return this.http.get<number>(`${myUrl}`);
}    

}
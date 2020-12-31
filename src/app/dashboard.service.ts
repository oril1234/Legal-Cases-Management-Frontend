import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Student }from './_models/student'
import { ClinicalSupervisor } from './_models/clinical-supervisor';
import { LegalCase } from './_models/legal-case';
import { Clinic } from './_models/clinic';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http:HttpClient) { }

  getNumberOfClosedCasesThisYear(){
    let myUrl="http://localhost:9090/api/v1/legalcase/closedCases"
    return this.http.get<number>(`${myUrl}`); 

  }

  getNumberOfCourtsCasesThisYear(){
    let myUrl="http://localhost:9090/api/v1/legalcase/casesHalfYear"
    return this.http.get<number>(`${myUrl}`); 

  }

  getAllStudents()
  {
    let myUrl="http://localhost:9090/api/v1/student"
    return this.http.get<Student[]>(`${myUrl}`); 

  }

  addNewStudent(student:Student)
  {
    let myUrl="http://localhost:9090/api/v1/student"
    return this.http.post<Student[]>(`${myUrl}`,student); 

  }

  getAllSupervisors()
  {
    let myUrl="http://localhost:9090/api/v1/clinicalSupervisor"
    return this.http.get<ClinicalSupervisor[]>(`${myUrl}`); 

  }

  getAllCases()
  {
    let myUrl="http://localhost:9090/api/v1/legalcase"
    return this.http.get<LegalCase[]>(`${myUrl}`); 

  }
  getAllClinic()
  {
    let myUrl="http://localhost:9090/api/v1/clinic"
    return this.http.get<Clinic[]>(`${myUrl}`); 

  }


  getNumberOfCasesByClinicName(clinicName:string)
  {
    
    let myUrl="http://localhost:9090/api/v1/legalcase/clinic";
    return this.http.get<number>(`${myUrl}/${clinicName}`); 

  }

}

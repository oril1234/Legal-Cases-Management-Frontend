import { Component, OnInit } from '@angular/core';
import {Chart} from 'chart.js'
import { StudentsComponent } from 'src/app/component/students/students.component';
import { DashboardService } from 'src/app/dashboard.service';
import { LegalCaseCounter } from 'src/app/_models/legal-case-counter';
import { Student } from 'src/app/_models/student';

@Component({
  selector: 'app-students-statistics',
  templateUrl: './students-statistics.component.html',
  styleUrls: ['./students-statistics.component.css']
})
export class StudentsStatisticsComponent implements OnInit {
  lcaseCounter:LegalCaseCounter[]=[];

  constructor(private dashboardService:DashboardService) { }

  ngOnInit(): void {
  }

  getAllClinics()
  {
    this.dashboardService.getNumberOfCasesPerStudentByClinic("הקליניקה לזכויות אדם").subscribe(
			data=> {
				this.lcaseCounter=data;

        let studentsData:number[]=[];
        let studentsLabels:string[]=[];

        }
    )
            


  

        
  }

}

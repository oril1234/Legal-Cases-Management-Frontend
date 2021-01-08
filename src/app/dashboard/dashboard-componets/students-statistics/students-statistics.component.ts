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
    //Bar charts of students
    studentsChart!:Chart

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
        this.lcaseCounter.forEach(element=>
          {
            studentsData.push(element.amountOfCases);
            studentsLabels.push(element.studentName);
          })

          var myChart = new Chart("clinicChart", {
            type: 'bar',
            data: {
                labels: studentsLabels,
                datasets: [{
                    label: '',
                    data: studentsData,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',

                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                    xAxes: [
                      {
                        ticks: {
                          /*
                          callback: function(label, index, labels) {
                            if (/\s/.test(<string>label)) {
                              return (<string>label).split(" ");
                            }else{
                              return (<string>label);
                            }              
                          }
                          */
                        }
                      }
                    ]
                }
            }
        });
        this.studentsChart=myChart;

        }
    )
            


  

        
  }

}

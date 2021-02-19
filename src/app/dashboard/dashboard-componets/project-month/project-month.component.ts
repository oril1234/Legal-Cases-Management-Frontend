import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { Clinic } from 'src/app/_models/clinic';
import {Chart} from 'chart.js'


@Component({
  selector: 'app-project-month',
  templateUrl: './project-month.component.html',
  styleUrls: ['./project-month.component.css']
})
export class ProjectMonthComponent implements OnInit {

  clinics!:Clinic[];
  //casesNumber:casesNumByClinic[]=[];
  casesNumber: Array<any> = [];
  clinicChart!:Chart

    

  


  constructor(private httpService:HttpService) {
    this.getAllClinics();
    this.getCasesNumByClinic();
   }

  ngOnInit(): void {
  
  
  }
  getAllClinics()
  {
    this.httpService.getAllClinic().subscribe(
			data=> {
				this.clinics=data;
        this.clinics.forEach(element=>
          {
            this.httpService.getNumberOfCasesByClinicName(element.clinicName).subscribe(
              data2=>{
                const newData={clinicName:element.clinicName,casesNumber:data2};
                let splitted=newData.clinicName.split(" ");
                if(splitted[1].charAt(0)!='ה')
                  splitted[1]=splitted[1].substr(1);
                splitted.splice(0,1);
                newData.clinicName=splitted.join(' ');
                this.casesNumber.push(newData);

              },
              err=>{},
              ()=>{
                let justData=[1,3]
                let clinicChartData:number[]=[];
                let clinicLabels:string[]=[];
                this.casesNumber.forEach(element=>
                  {
                    clinicChartData.push(element.casesNumber);
                    clinicLabels.push(element.clinicName);
                  })

                  var myChart = new Chart("clinicChart", {
                    type: 'bar',
                    data: {
                        labels: clinicLabels,
                        datasets: [{
                            label: '',
                            data: clinicChartData,
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

                        }
                    }
                });
                this.clinicChart=myChart;
                 
              }
            )
          })
        

			},

				);

        
  }
  getCasesNumByClinic()
 {

      
 }

}


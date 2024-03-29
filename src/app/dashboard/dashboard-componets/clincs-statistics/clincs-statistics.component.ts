import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { Clinic } from 'src/app/_models/clinic';
import {Chart} from 'chart.js'
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BetweenDates } from 'src/app/_models/between-dates';


@Component({
  selector: 'app-clincs-statistics',
  templateUrl: './clincs-statistics.component.html',
})

//Component of statistics of clinics 
export class ClincsStatisticsComponent implements OnInit {

  //All clinics
  clinics!:Clinic[];

  casesNumber: Array<any> = [];
  
  //Bar charts of clinic
  clinicChart!:Chart

  //Reason to close modal window
  closeResult=""

  //The start date of the range of dates from which data will be fetched
  startDate=new Date('2020-1-1');

  //The end date of the range of dates from which data will be fetched
  endDate=new Date('2021-1-1');

  


  constructor(private httpService:HttpService, private modalService:NgbModal) {
    this.getAllClinics();
    this.getCasesNumByClinic();
    
   }

  ngOnInit(): void {
  
  
  }


  //Open modal window
  open(content:string,empty:string) {
		this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'dark-modal'}).result.then((result) => {
			this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

		});
		
	}

  //Reason to close modal window
  private getDismissReason(reason: ModalDismissReasons): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return  `with: ${reason}`;
		}
	}


  //Get all clinics in system in order to create bar chart
  getAllClinics()
  {
    this.httpService.getAllClinic().subscribe(
			data=> {

        let between=new BetweenDates();
        between.startDate=this.startDate;
        between.endDate=this.endDate;

        this.clinics=data;
        this.casesNumber = [];
        this.clinics.forEach(clinic=>
          {
            this.httpService.numberOfCasesToCourtInChosenClinicBetween2Dates(clinic.clinicName, between).subscribe(
              amount=>{

                const newData = {
                  clinicName:clinic.clinicName,
                  casesNumber:amount.toString(),
                };

                this.casesNumber.push(newData);

              },
              err=>{},
              ()=>{
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
                      events: [],
                      responsive:true,
                      onResize:null,	 
                      scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    stepSize: 1.0,
                                }
                            }],
                            xAxes: [
                              {
                                ticks: {
                                  callback: function(label, index, labels) {
                                    return <string>label;
                                  }
                                }
                              }
                            ]
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
  updateData() 
  {
    this.getAllClinics();
  }
  getCasesNumByClinic()
 {

      
 }

}


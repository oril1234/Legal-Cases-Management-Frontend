import { Component, Input, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import {  ReactiveFormsModule,FormsModule} from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';



@Component({
  selector: 'app-close-cases',
  templateUrl: './close-cases.component.html',
  styleUrls: ['./close-cases.component.css']
})

//Component of cases that were closed
export class CloseCasesComponent implements OnInit {

  //Number of closed cases
  closedCasesNumber:number=0;

  //Reason to close modal window
  closeResult=""

	datesGroup=new FormGroup({
    startDate:new FormControl(''),
    endDate: new FormControl(''),
    });

  constructor(private httpService:HttpService) { 
  
  
    this.getClosedCasesLastPastYear();
  }


  ngOnInit(): void {
 
  }

  //Get closed legal cases in the past year 
  getClosedCasesLastPastYear()
  {
    this.httpService.getNumberOfClosedCasesPassedYear().subscribe(
      data=>{
        this.closedCasesNumber=data;
      },
      err=>{
        
      }
    )
  }


}


import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

//This is a class for the calendat component that appears on dashboard
export class CalendarComponent implements OnInit {

  todayCol:number=0;
  todayRow:number=0
  datesData:any[]=[]
  currentMonth:number
  currentYear:number
  monthAndYear:string=""
  constructor() { }

  ngOnInit(): void {
    this.showCalendar();
  }


 showCalendar()
 {
let today = new Date();
this.currentMonth = today.getMonth();
this.currentYear = today.getFullYear();
let months = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];
this.monthAndYear=months[this.currentMonth]+" "+this.currentYear;
let firstDay = (new Date(this.currentYear, this.currentMonth)).getDay();
let daysInMonth = 32 - new Date(this.currentYear, this.currentMonth, 32).getDate();



// creating all cells
let date = 1;
for (let i = 0; i < 6; i++) {


  let singleRow=[];
    //creating individual cells, filing them up with data.
    for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          singleRow.push("");
        }
        else if (date > daysInMonth) 
        {
          singleRow.push("");
        }

        else {
          singleRow.push(date);
            if (date === today.getDate() && this.currentYear === today.getFullYear() && this.currentMonth === today.getMonth()) {
                //cell.classList.add("bg-info");
                this.todayRow=i;
                this.todayCol=j;
            } // color today's date
            date++;
        }

        
    }
    this.datesData.push(singleRow);

}
 } 









}

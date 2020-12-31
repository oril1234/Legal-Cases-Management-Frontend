import { Component, ViewChild } from '@angular/core';
import { NgbCarouselConfig, NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AssertNotNull } from '@angular/compiler';
import { DashboardService } from 'src/app/dashboard.service';
import { LegalCase } from 'src/app/_models/legal-case';

@Component({
	selector: 'app-ngbd-buttons-radio',
	templateUrl: './legalCases.html',
	providers: [NgbCarouselConfig]
})
export class LegalCasesComponent {
	cases!:LegalCase[];

	constructor(private dashboardService: DashboardService) {
		this.getAllCases();

	}

	getAllCases()
	{
		this.dashboardService.getAllCases().subscribe(
			data=> {
				this.cases=data;
			}
			
	
				);
	}


}

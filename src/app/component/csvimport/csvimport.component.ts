import { UploaderService } from "../../services/uploader.service";
import {FormBuilder} from "@angular/forms";
import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DashboardService } from "src/app/dashboard.service";
import {  HttpParams, HttpClient } from '@angular/common/http';
import { tap } from "rxjs/operators";
import { MatStepper } from '@angular/material/stepper';
 
@Component({
	selector: 'stepper-overview-example',
	templateUrl: 'csvimport.component.html',
	encapsulation: ViewEncapsulation.None,
	styleUrls: ['stepper-overview-example.css'],
}) 
export class CsvImportComponent implements OnInit { 

	goBack(){
		this.myStepper.previous();
	}

	goForward(){
		this.myStepper.next();
	}

	isLinear = true;
	firstFormGroup: FormGroup;
	secondFormGroup: FormGroup;
	constructor(private http:HttpClient, private dashboardService: DashboardService, private _formBuilder: FormBuilder, private uploader: UploaderService) {}

	ngOnInit() {
		
		this.firstFormGroup = this._formBuilder.group({
		firstCtrl: ['', Validators.required]
		});
		this.secondFormGroup = this._formBuilder.group({
		secondCtrl: ['', Validators.required]
		});

		this.uploader.progressSource.subscribe(progress => {
			this.progress = progress;
		  });


  	}

	result_data: any = "";
	@ViewChild('stepper') private myStepper: MatStepper;
	progress: number;
	infoMessage: any;
	isUploading: boolean = false;
	file: File;
  
	imageUrl: string | ArrayBuffer =
	  "https://bulma.io/images/placeholders/480x480.png";
	fileName: string = "No file selected";
	remote_file_url: string;
  
	onChange(file: File) {
		if (file) {
		this.fileName = file.name;
		this.file = file;
		
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = event => {
		  this.imageUrl = reader.result;
		};
	  }
	}
  
	prepareData(data: any) {
		console.log(data);
		this.remote_file_url = data["file_name"];
		this.result_data = JSON.parse(JSON.stringify(data["mapping"]));
		console.log(this.result_data);
	}

	onUpload() {
	  this.infoMessage = null;
	  this.progress = 0;
	  this.isUploading = true;
	 
	  this.uploader.upload(this.file).subscribe(message => {
		this.isUploading = false;
		this.prepareData(message);
		this.isLinear = false;
	  });
	} 

	confirmUpload() {
		let res = this.uploader.confirmupload(this.remote_file_url).subscribe(
			(res) => {
				let resJSON = JSON.parse(JSON.stringify(res));
				console.log(resJSON);
			
			}
		);
	}

}

class MapOfField
{
	fieldName: string;
	mappedField: string;

	public toString = () : string => {
        return `<tr><td>${this.fieldName}</td><td>${this.mappedField}</td></tr>)`;
    }

}
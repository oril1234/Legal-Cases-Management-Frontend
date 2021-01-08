import { Routes } from '@angular/router';



import { StudentsComponent } from './students/students.component';
import { SupervisorsComponent } from './supervisors/supervisors.component';
import { LegalCasesComponent } from './LegalCases/legalCases.component';

import { ClinicsComponent } from './clinics/clinicscomponent';
import { CsvImportComponent } from './csvimport/csvimport.component';



export const ComponentsRoutes: Routes = [
	{
		path: '',
		children: [

			{
				path: 'students',
				component:StudentsComponent,
				data: {
					title: 'Students',
					urls: [
						{ title: 'Dashboard', url: '/dashboard' },
						{ title: 'ngComponent' },
						{ title: 'Accordion' }
					]
				}
			},

			{
				path: 'students/:clinic',
				component:StudentsComponent,
				data: {
					title: 'Students',
					urls: [
						{ title: 'Dashboard', url: '/dashboard' },
						{ title: 'ngComponent' },
						{ title: 'Accordion' }
					]
				}
			},

			{
				path: 'supervisors',
				component: SupervisorsComponent,
				data: {
					title: 'Alert',
					urls: [
						{ title: 'Dashboard', url: '/dashboard' },
						{ title: 'ngComponent' },
						{ title: 'Alert' }
					]
				}
			},
			{
				path: 'legalCases',
				component: LegalCasesComponent,
				data: {
					title: 'Carousel',
					urls: [
						{ title: 'Dashboard', url: '/dashboard' },
						{ title: 'ngComponent' },
						{ title: 'Carousel' }
					]
				}
			},
			{
				path: 'legalCases/:status',
				component: LegalCasesComponent,
				data: {
					title: 'Carousel',
					urls: [
						{ title: 'Dashboard', url: '/dashboard' },
						{ title: 'ngComponent' },
						{ title: 'Carousel' }
					]
				}
			},

			{
				path: 'clinics',
				component: ClinicsComponent,
				data: {
					title: 'Dropdown',
					urls: [
						{ title: 'Dashboard', url: '/dashboard' },
						{ title: 'ngComponent' },
						{ title: 'Dropdown' }
					]
				}
			},
			{
				path: 'csvimport',
				component: CsvImportComponent,
				data: {
					title: 'Dropdown',
					urls: [
						{ title: 'Dashboard', url: '/dashboard' },
						{ title: 'ngComponent' },
						{ title: 'Dropdown' }
					]
				}
			},


			
		]
	}
];

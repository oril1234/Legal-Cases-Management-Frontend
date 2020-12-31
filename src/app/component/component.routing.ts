import { Routes } from '@angular/router';



import { StudentsComponent } from './students/students.component';
import { SupervisorsComponent } from './supervisors/supervisors.component';
import { LegalCasesComponent } from './LegalCases/legalCases.component';

import { ClinicsComponent } from './clinics/clinicscomponent';



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
				path: 'dropdown',
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


			
		]
	}
];

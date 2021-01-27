import { Routes } from '@angular/router';



import { StudentsComponent } from './students/students.component';
import { SupervisorsComponent } from './supervisors/supervisors.component';
import { LegalCasesComponent } from './LegalCases/legalCases.component';

import { ClinicsComponent } from './clinics/clinicscomponent';
import { CsvImportComponent } from './csvimport/csvimport.component';
import { AssignedCaseComponent } from './assigned-case/assigned-case.component';
import { LegislativeProposal } from '../_models/legislative-proposal';
import { LegislativeProposalComponent } from './legislative-proposal/legislative-proposal.component';
import { ResearchComponent } from './research/research.component';
import { PolicyPaperComponent } from './policy-paper/policy-paper.component';



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
				path: 'legislativeProposal',
				component: LegislativeProposalComponent,
				data: {
					title: 'LegislativeProposal',
					urls: [
						{ title: 'ngComponent' },
					]
				}
			},

			
			{
				path: 'research',
				component: ResearchComponent,
				data: {
					title: 'LegislativeProposal',
					urls: [
						{ title: 'ngComponent' },
					]
				}
			},
			{
				path: 'policy_paper',
				component: PolicyPaperComponent,
				data: {
					title: 'LegislativeProposal',
					urls: [
						{ title: 'ngComponent' },
					]
				}
			},

			{
				path: 'assignedCases',
				component: AssignedCaseComponent,
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

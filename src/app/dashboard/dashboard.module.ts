import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import { DashboardComponent } from './dashboard.component';
import { ClincsStatisticsComponent } from './dashboard-componets/clincs-statistics/clincs-statistics.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { SupervisorDashboardComponent } from './supervisor-dashboard/supervisor-dashboard.component';
import { SuperAdminDashboardComponent } from './super-admin-dashboard/super-admin-dashboard.component';
import { StudentsStatisticsComponent } from './dashboard-componets/students-statistics/students-statistics.component';
import { CloseCasesComponent } from './dashboard-componets/close-cases/close-cases.component';
import { CaseInCourtComponent } from './dashboard-componets/case-in-court/case-in-court.component'
import { NotificationsComponent } from '../notifications/notifications.component';
import { CalendarComponent } from './calendar/calendar.component';
import { PersonalDetailsComponent } from '../personal-details/personal-details.component';

const routes: Routes = [
	{
		path: '',
		data: {
			title: 'Dashboard',
			urls: [
				{ title: 'Dashboard', url: '/dashboard' },
				{ title: 'Dashboard' },
			]
		},
		component: DashboardComponent
	},
	{path:'notifications', component:NotificationsComponent},
	{path:'personal_details', component:PersonalDetailsComponent}
];

@NgModule({
	imports: [FormsModule, CommonModule, RouterModule.forChild(routes), ChartsModule],
	declarations: [DashboardComponent,  ClincsStatisticsComponent, StudentDashboardComponent, SupervisorDashboardComponent, SuperAdminDashboardComponent, StudentsStatisticsComponent, CloseCasesComponent, CaseInCourtComponent, CalendarComponent]
})
export class DashboardModule {}

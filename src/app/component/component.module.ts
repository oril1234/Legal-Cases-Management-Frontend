import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ComponentsRoutes } from './component.routing';
import { StudentsComponent } from './students/students.component';
import { SupervisorsComponent } from './supervisors/supervisors.component';
import { LegalCasesComponent } from './LegalCases/legalCases.component';

import { ClinicsComponent } from './clinics/clinicscomponent';



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ComponentsRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  declarations: [
    StudentsComponent,
    SupervisorsComponent,
    LegalCasesComponent,
    ClinicsComponent,

    
  ]
})
export class ComponentsModule {}

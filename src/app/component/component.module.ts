import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ComponentsRoutes } from './component.routing';
import { StudentsComponent } from './students/students.component';
import { SupervisorsComponent } from './supervisors/supervisors.component';
import { LegalCasesComponent } from './LegalCases/legalCases.component';
import { CsvImportComponent } from './csvimport/csvimport.component';
import { ClinicsComponent } from './clinics/clinicscomponent';
import { MatSliderModule } from '@angular/material/slider';
import {MatStepperModule} from '@angular/material/stepper';
import { AssignedCaseComponent } from './assigned-case/assigned-case.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ComponentsRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    MatSliderModule,
    MatStepperModule,
  ],
  declarations: [
    StudentsComponent,
    SupervisorsComponent,
    LegalCasesComponent,
    ClinicsComponent,
    CsvImportComponent,
    AssignedCaseComponent,
  ]
})
export class ComponentsModule {}

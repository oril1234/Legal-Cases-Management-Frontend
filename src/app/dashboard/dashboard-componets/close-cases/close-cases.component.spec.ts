import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseCasesComponent } from './close-cases.component';

describe('CloseCasesComponent', () => {
  let component: CloseCasesComponent;
  let fixture: ComponentFixture<CloseCasesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloseCasesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseCasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

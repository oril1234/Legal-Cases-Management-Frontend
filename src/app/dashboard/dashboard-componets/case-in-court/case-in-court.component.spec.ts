import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseInCourtComponent } from './case-in-court.component';

describe('CaseInCourtComponent', () => {
  let component: CaseInCourtComponent;
  let fixture: ComponentFixture<CaseInCourtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseInCourtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseInCourtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

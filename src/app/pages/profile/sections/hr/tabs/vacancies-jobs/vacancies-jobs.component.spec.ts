import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacanciesJobsComponent } from './vacancies-jobs.component';

describe('VacanciesJobsComponent', () => {
  let component: VacanciesJobsComponent;
  let fixture: ComponentFixture<VacanciesJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VacanciesJobsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VacanciesJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

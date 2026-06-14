import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumesJobsComponent } from './resumes-jobs.component';

describe('ResumesJobsComponent', () => {
  let component: ResumesJobsComponent;
  let fixture: ComponentFixture<ResumesJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumesJobsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumesJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

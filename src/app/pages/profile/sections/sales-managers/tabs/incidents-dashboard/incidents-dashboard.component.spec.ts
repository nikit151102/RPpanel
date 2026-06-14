import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentsDashboardComponent } from './incidents-dashboard.component';

describe('IncidentsDashboardComponent', () => {
  let component: IncidentsDashboardComponent;
  let fixture: ComponentFixture<IncidentsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentsDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

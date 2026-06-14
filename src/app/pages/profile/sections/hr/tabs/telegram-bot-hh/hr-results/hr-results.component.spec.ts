import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrResultsComponent } from './hr-results.component';

describe('HrResultsComponent', () => {
  let component: HrResultsComponent;
  let fixture: ComponentFixture<HrResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HrResultsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HrResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

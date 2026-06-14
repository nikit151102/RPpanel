import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVacationModalComponent } from './create-vacation-modal.component';

describe('CreateVacationModalComponent', () => {
  let component: CreateVacationModalComponent;
  let fixture: ComponentFixture<CreateVacationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateVacationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateVacationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

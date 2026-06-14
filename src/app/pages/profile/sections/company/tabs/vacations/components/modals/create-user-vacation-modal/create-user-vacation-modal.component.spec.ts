import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUserVacationModalComponent } from './create-user-vacation-modal.component';

describe('CreateUserVacationModalComponent', () => {
  let component: CreateUserVacationModalComponent;
  let fixture: ComponentFixture<CreateUserVacationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUserVacationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateUserVacationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

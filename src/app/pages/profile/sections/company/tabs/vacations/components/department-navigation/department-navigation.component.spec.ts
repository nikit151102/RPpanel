import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentNavigationComponent } from './department-navigation.component';

describe('DepartmentNavigationComponent', () => {
  let component: DepartmentNavigationComponent;
  let fixture: ComponentFixture<DepartmentNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentNavigationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

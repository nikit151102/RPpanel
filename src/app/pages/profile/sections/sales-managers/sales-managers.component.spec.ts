import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesManagersComponent } from './sales-managers.component';

describe('SalesManagersComponent', () => {
  let component: SalesManagersComponent;
  let fixture: ComponentFixture<SalesManagersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesManagersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesManagersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WholesaleRequestsComponent } from './wholesale-requests.component';

describe('WholesaleRequestsComponent', () => {
  let component: WholesaleRequestsComponent;
  let fixture: ComponentFixture<WholesaleRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WholesaleRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WholesaleRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

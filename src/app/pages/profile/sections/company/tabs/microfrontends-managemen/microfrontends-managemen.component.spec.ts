import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MicrofrontendsManagemenComponent } from './microfrontends-managemen.component';

describe('MicrofrontendsManagemenComponent', () => {
  let component: MicrofrontendsManagemenComponent;
  let fixture: ComponentFixture<MicrofrontendsManagemenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MicrofrontendsManagemenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MicrofrontendsManagemenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStoreModalComponent } from './create-store-modal.component';

describe('CreateStoreModalComponent', () => {
  let component: CreateStoreModalComponent;
  let fixture: ComponentFixture<CreateStoreModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateStoreModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateStoreModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

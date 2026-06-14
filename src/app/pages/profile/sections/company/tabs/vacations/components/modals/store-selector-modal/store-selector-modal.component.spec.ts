import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreSelectorModalComponent } from './store-selector-modal.component';

describe('StoreSelectorModalComponent', () => {
  let component: StoreSelectorModalComponent;
  let fixture: ComponentFixture<StoreSelectorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreSelectorModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreSelectorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

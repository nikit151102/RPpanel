import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRolesModalComponent } from './manage-roles-modal.component';

describe('ManageRolesModalComponent', () => {
  let component: ManageRolesModalComponent;
  let fixture: ComponentFixture<ManageRolesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageRolesModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageRolesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

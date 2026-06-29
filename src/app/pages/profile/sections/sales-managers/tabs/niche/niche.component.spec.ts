import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NicheComponent } from './niche.component';

describe('NicheComponent', () => {
  let component: NicheComponent;
  let fixture: ComponentFixture<NicheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NicheComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NicheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

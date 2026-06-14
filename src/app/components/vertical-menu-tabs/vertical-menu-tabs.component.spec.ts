import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalMenuTabsComponent } from './vertical-menu-tabs.component';

describe('VerticalMenuTabsComponent', () => {
  let component: VerticalMenuTabsComponent;
  let fixture: ComponentFixture<VerticalMenuTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerticalMenuTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerticalMenuTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

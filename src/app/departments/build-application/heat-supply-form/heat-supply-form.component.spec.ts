import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatSupplyFormComponent } from './heat-supply-form.component';

describe('HeatSupplyFormComponent', () => {
  let component: HeatSupplyFormComponent;
  let fixture: ComponentFixture<HeatSupplyFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeatSupplyFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeatSupplyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

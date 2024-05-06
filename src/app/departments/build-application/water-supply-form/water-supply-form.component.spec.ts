import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterSupplyFormComponent } from './water-supply-form.component';

describe('WaterSupplyFormComponent', () => {
  let component: WaterSupplyFormComponent;
  let fixture: ComponentFixture<WaterSupplyFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaterSupplyFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterSupplyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

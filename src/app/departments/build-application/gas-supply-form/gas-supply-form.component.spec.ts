import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GasSupplyFormComponent } from './gas-supply-form.component';

describe('GasSupplyFormComponent', () => {
  let component: GasSupplyFormComponent;
  let fixture: ComponentFixture<GasSupplyFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GasSupplyFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GasSupplyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

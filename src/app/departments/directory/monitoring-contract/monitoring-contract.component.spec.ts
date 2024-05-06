import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringContractComponent } from './monitoring-contract.component';

describe('MonitoringContractComponent', () => {
  let component: MonitoringContractComponent;
  let fixture: ComponentFixture<MonitoringContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoringContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

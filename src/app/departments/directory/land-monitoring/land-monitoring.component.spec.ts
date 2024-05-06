import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandMonitoringComponent } from './land-monitoring.component';

describe('LandMonitoringComponent', () => {
  let component: LandMonitoringComponent;
  let fixture: ComponentFixture<LandMonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandMonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

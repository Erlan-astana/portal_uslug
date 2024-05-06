import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceStatisticsComponent } from './service-statistics.component';

describe('ServiceStatisticsComponent', () => {
  let component: ServiceStatisticsComponent;
  let fixture: ComponentFixture<ServiceStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceExecutorsComponent } from './service-executors.component';

describe('ServiceExecutorsComponent', () => {
  let component: ServiceExecutorsComponent;
  let fixture: ComponentFixture<ServiceExecutorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceExecutorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceExecutorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

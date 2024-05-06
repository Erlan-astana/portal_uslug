import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleServicesComponent } from './role-services.component';

describe('RoleServicesComponent', () => {
  let component: RoleServicesComponent;
  let fixture: ComponentFixture<RoleServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

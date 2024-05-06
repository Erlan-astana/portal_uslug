import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseSpecialistComponent } from './base-specialist.component';

describe('BaseSpecialistComponent', () => {
  let component: BaseSpecialistComponent;
  let fixture: ComponentFixture<BaseSpecialistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseSpecialistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseSpecialistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

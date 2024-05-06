import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecregFormComponent } from './specreg-form.component';

describe('SpecregFormComponent', () => {
  let component: SpecregFormComponent;
  let fixture: ComponentFixture<SpecregFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecregFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecregFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

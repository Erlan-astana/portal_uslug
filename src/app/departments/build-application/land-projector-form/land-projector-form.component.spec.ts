import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandProjectorFormComponent } from './land-projector-form.component';

describe('LandProjectorFormComponent', () => {
  let component: LandProjectorFormComponent;
  let fixture: ComponentFixture<LandProjectorFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandProjectorFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandProjectorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

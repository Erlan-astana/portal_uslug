import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SewerageFormComponent } from './sewerage-form.component';

describe('SewerageFormComponent', () => {
  let component: SewerageFormComponent;
  let fixture: ComponentFixture<SewerageFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SewerageFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SewerageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

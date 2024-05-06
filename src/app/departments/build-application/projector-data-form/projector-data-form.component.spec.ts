import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectorDataFormComponent } from './projector-data-form.component';

describe('ProjectorDataFormComponent', () => {
  let component: ProjectorDataFormComponent;
  let fixture: ComponentFixture<ProjectorDataFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectorDataFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectorDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

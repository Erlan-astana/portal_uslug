import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectDataFormComponent } from './object-data-form.component';

describe('ObjectDataFormComponent', () => {
  let component: ObjectDataFormComponent;
  let fixture: ComponentFixture<ObjectDataFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjectDataFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

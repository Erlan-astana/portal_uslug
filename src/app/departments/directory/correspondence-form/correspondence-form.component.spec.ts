import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrespondenceFormComponent } from './correspondence-form.component';

describe('CorrespondenceFormComponent', () => {
  let component: CorrespondenceFormComponent;
  let fixture: ComponentFixture<CorrespondenceFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorrespondenceFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrespondenceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

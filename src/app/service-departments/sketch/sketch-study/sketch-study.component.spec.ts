import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SketchStudyComponent } from './sketch-study.component';

describe('SketchStudyComponent', () => {
  let component: SketchStudyComponent;
  let fixture: ComponentFixture<SketchStudyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SketchStudyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SketchStudyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SketchViewCardComponent } from './sketch-view-card.component';

describe('SketchViewCardComponent', () => {
  let component: SketchViewCardComponent;
  let fixture: ComponentFixture<SketchViewCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SketchViewCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SketchViewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

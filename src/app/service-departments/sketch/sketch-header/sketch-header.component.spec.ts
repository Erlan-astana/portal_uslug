import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SketchHeaderComponent } from './sketch-header.component';

describe('SketchHeaderComponent', () => {
  let component: SketchHeaderComponent;
  let fixture: ComponentFixture<SketchHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SketchHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SketchHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

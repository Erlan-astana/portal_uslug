import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrespondencesComponent } from './correspondences.component';

describe('CorrespondencesComponent', () => {
  let component: CorrespondencesComponent;
  let fixture: ComponentFixture<CorrespondencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorrespondencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrespondencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

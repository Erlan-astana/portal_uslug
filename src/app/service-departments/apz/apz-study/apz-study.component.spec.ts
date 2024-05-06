import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApzStudyComponent } from './apz-study.component';

describe('ApzStudyComponent', () => {
  let component: ApzStudyComponent;
  let fixture: ComponentFixture<ApzStudyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApzStudyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApzStudyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

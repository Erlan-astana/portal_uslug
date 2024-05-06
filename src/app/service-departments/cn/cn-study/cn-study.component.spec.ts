import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CnStudyComponent } from './cn-study.component';

describe('CnStudyComponent', () => {
  let component: CnStudyComponent;
  let fixture: ComponentFixture<CnStudyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CnStudyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CnStudyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

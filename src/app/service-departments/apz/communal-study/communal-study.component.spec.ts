import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunalStudyComponent } from './communal-study.component';

describe('CommunalStudyComponent', () => {
  let component: CommunalStudyComponent;
  let fixture: ComponentFixture<CommunalStudyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunalStudyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunalStudyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortServiceStudyComponent } from './short-service-study.component';

describe('ShortServiceStudyComponent', () => {
  let component: ShortServiceStudyComponent;
  let fixture: ComponentFixture<ShortServiceStudyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShortServiceStudyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortServiceStudyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnershipStudyComponent } from './ownership-study.component';

describe('OwnershipStudyComponent', () => {
  let component: OwnershipStudyComponent;
  let fixture: ComponentFixture<OwnershipStudyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnershipStudyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnershipStudyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

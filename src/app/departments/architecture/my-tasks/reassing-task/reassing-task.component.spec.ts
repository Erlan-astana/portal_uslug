import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReassingTaskComponent } from './reassing-task.component';

describe('ReassingTaskComponent', () => {
  let component: ReassingTaskComponent;
  let fixture: ComponentFixture<ReassingTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReassingTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReassingTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

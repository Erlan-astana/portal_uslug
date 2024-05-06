import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OzoHistoryComponent } from './ozo-history.component';

describe('OzoHistoryComponent', () => {
  let component: OzoHistoryComponent;
  let fixture: ComponentFixture<OzoHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OzoHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OzoHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

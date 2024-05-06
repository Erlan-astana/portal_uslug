import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecregHistoryComponent } from './specreg-history.component';

describe('SpecregHistoryComponent', () => {
  let component: SpecregHistoryComponent;
  let fixture: ComponentFixture<SpecregHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecregHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecregHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecregExcludeComponent } from './specreg-exclude.component';

describe('SpecregExcludeComponent', () => {
  let component: SpecregExcludeComponent;
  let fixture: ComponentFixture<SpecregExcludeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecregExcludeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecregExcludeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

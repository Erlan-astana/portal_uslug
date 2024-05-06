import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecregComponent } from './specreg.component';

describe('SpecregComponent', () => {
  let component: SpecregComponent;
  let fixture: ComponentFixture<SpecregComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecregComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecregComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

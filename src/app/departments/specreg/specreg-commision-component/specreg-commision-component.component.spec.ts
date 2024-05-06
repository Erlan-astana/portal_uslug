import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecregCommisionComponentComponent } from './specreg-commision-component.component';

describe('SpecregCommisionComponentComponent', () => {
  let component: SpecregCommisionComponentComponent;
  let fixture: ComponentFixture<SpecregCommisionComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecregCommisionComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecregCommisionComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

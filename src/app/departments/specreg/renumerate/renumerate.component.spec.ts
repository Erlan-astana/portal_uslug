import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenumerateComponent } from './renumerate.component';

describe('RenumerateComponent', () => {
  let component: RenumerateComponent;
  let fixture: ComponentFixture<RenumerateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenumerateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenumerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

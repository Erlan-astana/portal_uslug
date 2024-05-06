import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignApplicationComponent } from './sign-application.component';

describe('SignApplicationComponent', () => {
  let component: SignApplicationComponent;
  let fixture: ComponentFixture<SignApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

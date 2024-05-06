import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderArchSpecialistComponent } from './header-arch-specialist.component';

describe('HeaderArchSpecialistComponent', () => {
  let component: HeaderArchSpecialistComponent;
  let fixture: ComponentFixture<HeaderArchSpecialistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderArchSpecialistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderArchSpecialistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

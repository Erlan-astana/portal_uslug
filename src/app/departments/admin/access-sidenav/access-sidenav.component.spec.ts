import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessSidenavComponent } from './access-sidenav.component';

describe('AccessSidenavComponent', () => {
  let component: AccessSidenavComponent;
  let fixture: ComponentFixture<AccessSidenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessSidenavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

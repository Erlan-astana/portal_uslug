import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSuberviceComponent } from './select-subervice.component';

describe('SelectSuberviceComponent', () => {
  let component: SelectSuberviceComponent;
  let fixture: ComponentFixture<SelectSuberviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectSuberviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectSuberviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

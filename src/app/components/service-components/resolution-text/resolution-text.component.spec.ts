import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolutionTextComponent } from './resolution-text.component';

describe('ResolutionTextComponent', () => {
  let component: ResolutionTextComponent;
  let fixture: ComponentFixture<ResolutionTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResolutionTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResolutionTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

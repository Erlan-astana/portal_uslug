import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowApplicationAccordionComponent } from './show-application-accordion.component';

describe('ShowApplicationAccordionComponent', () => {
  let component: ShowApplicationAccordionComponent;
  let fixture: ComponentFixture<ShowApplicationAccordionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowApplicationAccordionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowApplicationAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

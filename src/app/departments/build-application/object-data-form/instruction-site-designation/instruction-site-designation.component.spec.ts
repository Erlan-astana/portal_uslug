import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructionSiteDesignationComponent } from './instruction-site-designation.component';

describe('InstructionSiteDesignationComponent', () => {
  let component: InstructionSiteDesignationComponent;
  let fixture: ComponentFixture<InstructionSiteDesignationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstructionSiteDesignationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructionSiteDesignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

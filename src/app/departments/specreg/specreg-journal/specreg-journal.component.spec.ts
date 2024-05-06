import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecregJournalComponent } from './specreg-journal.component';

describe('SpecregJournalComponent', () => {
  let component: SpecregJournalComponent;
  let fixture: ComponentFixture<SpecregJournalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecregJournalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecregJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

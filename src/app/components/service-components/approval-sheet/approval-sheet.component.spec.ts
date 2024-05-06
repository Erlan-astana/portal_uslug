import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalSheetComponent } from './approval-sheet.component';

describe('ApprovalSheetComponent', () => {
  let component: ApprovalSheetComponent;
  let fixture: ComponentFixture<ApprovalSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

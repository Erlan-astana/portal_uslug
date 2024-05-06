import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentDocumentsComponent } from './attachment-documents.component';

describe('AttachmentDocumentsComponent', () => {
  let component: AttachmentDocumentsComponent;
  let fixture: ComponentFixture<AttachmentDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachmentDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

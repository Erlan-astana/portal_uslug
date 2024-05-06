import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmDocumentsComponent } from './adm-documents.component';

describe('AdmDocumentsComponent', () => {
  let component: AdmDocumentsComponent;
  let fixture: ComponentFixture<AdmDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

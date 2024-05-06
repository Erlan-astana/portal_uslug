import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmDocumentsFormComponent } from './adm-documents-form.component';

describe('AdmDocumentsFormComponent', () => {
  let component: AdmDocumentsFormComponent;
  let fixture: ComponentFixture<AdmDocumentsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmDocumentsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmDocumentsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

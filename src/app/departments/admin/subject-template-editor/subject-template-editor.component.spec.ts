import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectTemplateEditorComponent } from './subject-template-editor.component';

describe('SubjectTemplateEditorComponent', () => {
  let component: SubjectTemplateEditorComponent;
  let fixture: ComponentFixture<SubjectTemplateEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectTemplateEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectTemplateEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

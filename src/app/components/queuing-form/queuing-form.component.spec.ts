import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueuingFormComponent } from './queuing-form.component';

describe('QueuingFormComponent', () => {
  let component: QueuingFormComponent;
  let fixture: ComponentFixture<QueuingFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueuingFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueuingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

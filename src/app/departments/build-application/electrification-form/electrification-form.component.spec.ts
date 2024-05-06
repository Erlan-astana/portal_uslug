import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectrificationFormComponent } from './electrification-form.component';

describe('ElectrificationFormComponent', () => {
  let component: ElectrificationFormComponent;
  let fixture: ComponentFixture<ElectrificationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElectrificationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectrificationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

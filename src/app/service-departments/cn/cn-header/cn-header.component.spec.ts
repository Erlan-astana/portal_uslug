import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CnHeaderComponent } from './cn-header.component';

describe('CnHeaderComponent', () => {
  let component: CnHeaderComponent;
  let fixture: ComponentFixture<CnHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CnHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CnHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

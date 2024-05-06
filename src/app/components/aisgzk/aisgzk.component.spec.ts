import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AisgzkComponent } from './aisgzk.component';

describe('AisgzkComponent', () => {
  let component: AisgzkComponent;
  let fixture: ComponentFixture<AisgzkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AisgzkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AisgzkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunalHeaderComponent } from './communal-header.component';

describe('CommunalHeaderComponent', () => {
  let component: CommunalHeaderComponent;
  let fixture: ComponentFixture<CommunalHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunalHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunalHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

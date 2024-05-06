import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunalMapComponent } from './communal-map.component';

describe('CommunalMapComponent', () => {
  let component: CommunalMapComponent;
  let fixture: ComponentFixture<CommunalMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunalMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunalMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

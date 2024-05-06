import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchMapComponent } from './arch-map.component';

describe('ArchMapComponent', () => {
  let component: ArchMapComponent;
  let fixture: ComponentFixture<ArchMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

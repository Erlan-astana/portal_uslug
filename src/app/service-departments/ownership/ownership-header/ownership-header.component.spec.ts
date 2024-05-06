import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnershipHeaderComponent } from './ownership-header.component';

describe('OwnershipHeaderComponent', () => {
  let component: OwnershipHeaderComponent;
  let fixture: ComponentFixture<OwnershipHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnershipHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnershipHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

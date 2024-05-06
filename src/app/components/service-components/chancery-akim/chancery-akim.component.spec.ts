import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChanceryAkimComponent } from './chancery-akim.component';

describe('ChanceryAkimComponent', () => {
  let component: ChanceryAkimComponent;
  let fixture: ComponentFixture<ChanceryAkimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChanceryAkimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChanceryAkimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

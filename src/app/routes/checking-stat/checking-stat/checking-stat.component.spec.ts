import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckingStatComponent } from './checking-stat.component';

describe('CheckingStatComponent', () => {
  let component: CheckingStatComponent;
  let fixture: ComponentFixture<CheckingStatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckingStatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckingStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

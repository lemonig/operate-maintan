import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FastInputComponent } from './fast-input.component';

describe('FastInputComponent', () => {
  let component: FastInputComponent;
  let fixture: ComponentFixture<FastInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FastInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FastInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckingCityComponent } from './checking-city.component';

describe('CheckingCityComponent', () => {
  let component: CheckingCityComponent;
  let fixture: ComponentFixture<CheckingCityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckingCityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckingCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

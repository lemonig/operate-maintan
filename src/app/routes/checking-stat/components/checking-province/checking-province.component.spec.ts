import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckingProvinceComponent } from './checking-province.component';

describe('CheckingProvinceComponent', () => {
  let component: CheckingProvinceComponent;
  let fixture: ComponentFixture<CheckingProvinceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckingProvinceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckingProvinceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarfeeComponent } from './carfee.component';

describe('CarfeeComponent', () => {
  let component: CarfeeComponent;
  let fixture: ComponentFixture<CarfeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarfeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarfeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

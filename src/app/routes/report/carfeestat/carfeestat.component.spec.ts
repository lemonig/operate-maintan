import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarfeestatComponent } from './carfeestat.component';

describe('CarfeestatComponent', () => {
  let component: CarfeestatComponent;
  let fixture: ComponentFixture<CarfeestatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarfeestatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarfeestatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

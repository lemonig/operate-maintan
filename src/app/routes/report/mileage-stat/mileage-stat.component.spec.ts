import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MileageStatComponent } from './mileage-stat.component';


describe('MileageStatComponent', () => {
  let component: MileageStatComponent;
  let fixture: ComponentFixture<MileageStatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MileageStatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MileageStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

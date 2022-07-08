import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckingStaffComponent } from './checking-staff.component';

describe('CheckingStaffComponent', () => {
  let component: CheckingStaffComponent;
  let fixture: ComponentFixture<CheckingStaffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckingStaffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckingStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

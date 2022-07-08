import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbnormalStaffComponent } from './abnormal-staff.component';

describe('AbnormalStaffComponent', () => {
  let component: AbnormalStaffComponent;
  let fixture: ComponentFixture<AbnormalStaffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbnormalStaffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbnormalStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

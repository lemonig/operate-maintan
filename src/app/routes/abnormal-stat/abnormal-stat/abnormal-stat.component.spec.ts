import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbnormalStatComponent } from './abnormal-stat.component';

describe('AbnormalStatComponent', () => {
  let component: AbnormalStatComponent;
  let fixture: ComponentFixture<AbnormalStatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbnormalStatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbnormalStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

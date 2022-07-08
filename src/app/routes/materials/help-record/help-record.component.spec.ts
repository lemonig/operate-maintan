import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpRecordComponent } from './help-record.component';

describe('HelpRecordComponent', () => {
  let component: HelpRecordComponent;
  let fixture: ComponentFixture<HelpRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

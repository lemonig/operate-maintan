import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpUseRecordComponent } from './help-use-record.component';

describe('HelpUseRecordComponent', () => {
  let component: HelpUseRecordComponent;
  let fixture: ComponentFixture<HelpUseRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpUseRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpUseRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

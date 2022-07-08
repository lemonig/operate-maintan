import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UseRecordComponent } from './use-record.component';

describe('UseRecordComponent', () => {
  let component: UseRecordComponent;
  let fixture: ComponentFixture<UseRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UseRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UseRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

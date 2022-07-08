import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolRecordComponent } from './tool-record.component';

describe('ToolRecordComponent', () => {
  let component: ToolRecordComponent;
  let fixture: ComponentFixture<ToolRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

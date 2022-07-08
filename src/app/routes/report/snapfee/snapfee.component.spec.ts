import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnapfeeComponent } from './snapfee.component';

describe('SnapfeeComponent', () => {
  let component: SnapfeeComponent;
  let fixture: ComponentFixture<SnapfeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnapfeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnapfeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

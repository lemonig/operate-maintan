import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationfeeComponent } from './stationfee.component';

describe('StationfeeComponent', () => {
  let component: StationfeeComponent;
  let fixture: ComponentFixture<StationfeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationfeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationfeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StagPointComponent } from './stag-point.component';

describe('StagPointComponent', () => {
  let component: StagPointComponent;
  let fixture: ComponentFixture<StagPointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StagPointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StagPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

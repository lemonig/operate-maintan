import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReagentComponent } from './reagent.component';

describe('ReagentComponent', () => {
  let component: ReagentComponent;
  let fixture: ComponentFixture<ReagentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReagentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReagentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

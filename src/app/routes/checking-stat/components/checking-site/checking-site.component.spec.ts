import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckingSiteComponent } from './checking-site.component';

describe('CheckingSiteComponent', () => {
  let component: CheckingSiteComponent;
  let fixture: ComponentFixture<CheckingSiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckingSiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckingSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

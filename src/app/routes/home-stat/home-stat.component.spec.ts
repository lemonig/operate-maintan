import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeStatComponent } from './home-stat.component';

describe('HomeStatComponent', () => {
  let component: HomeStatComponent;
  let fixture: ComponentFixture<HomeStatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeStatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

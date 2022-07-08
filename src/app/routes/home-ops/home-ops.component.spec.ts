import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeOpsComponent } from './home-ops.component';

describe('HomeOpsComponent', () => {
  let component: HomeOpsComponent;
  let fixture: ComponentFixture<HomeOpsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeOpsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeOpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

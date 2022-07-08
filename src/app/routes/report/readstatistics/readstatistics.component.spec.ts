import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadstatisticsComponent } from './readstatistics.component';

describe('ReadstatisticsComponent', () => {
  let component: ReadstatisticsComponent;
  let fixture: ComponentFixture<ReadstatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadstatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadstatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

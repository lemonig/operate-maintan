import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MileageachievementsComponent } from './mileageachievements.component';

describe('MileageachievementsComponent', () => {
  let component: MileageachievementsComponent;
  let fixture: ComponentFixture<MileageachievementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MileageachievementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MileageachievementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

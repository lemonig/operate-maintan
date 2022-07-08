import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckingAchievementsComponent } from './checking-achievements.component';

describe('CheckingAchievementsComponent', () => {
  let component: CheckingAchievementsComponent;
  let fixture: ComponentFixture<CheckingAchievementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckingAchievementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckingAchievementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

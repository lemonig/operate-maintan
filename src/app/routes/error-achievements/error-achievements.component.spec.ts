import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorAchievementsComponent } from './error-achievements.component';

describe('ErrorAchievementsComponent', () => {
  let component: ErrorAchievementsComponent;
  let fixture: ComponentFixture<ErrorAchievementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorAchievementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorAchievementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

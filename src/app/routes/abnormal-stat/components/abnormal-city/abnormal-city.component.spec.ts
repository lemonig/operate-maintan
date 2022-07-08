import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbnormalCityComponent } from './abnormal-city.component';

describe('AbnormalCityComponent', () => {
  let component: AbnormalCityComponent;
  let fixture: ComponentFixture<AbnormalCityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbnormalCityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbnormalCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

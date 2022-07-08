import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPowerComponent } from './data-power.component';

describe('DataPowerComponent', () => {
  let component: DataPowerComponent;
  let fixture: ComponentFixture<DataPowerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataPowerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataPowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

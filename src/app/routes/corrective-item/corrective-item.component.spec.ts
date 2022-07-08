import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectiveItemComponent } from './corrective-item.component';

describe('CorrectiveItemComponent', () => {
  let component: CorrectiveItemComponent;
  let fixture: ComponentFixture<CorrectiveItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorrectiveItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrectiveItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

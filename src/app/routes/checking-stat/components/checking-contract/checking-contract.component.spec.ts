import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckingContractComponent } from './checking-contract.component';

describe('CheckingContractComponent', () => {
  let component: CheckingContractComponent;
  let fixture: ComponentFixture<CheckingContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckingContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckingContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

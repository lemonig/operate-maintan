import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractPendingComponent } from './contract-pending.component';

describe('ContractPendingComponent', () => {
  let component: ContractPendingComponent;
  let fixture: ComponentFixture<ContractPendingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractPendingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

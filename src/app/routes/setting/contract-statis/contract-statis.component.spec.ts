import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractStatisComponent } from './contract-statis.component';

describe('ContractStatisComponent', () => {
  let component: ContractStatisComponent;
  let fixture: ComponentFixture<ContractStatisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractStatisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractStatisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

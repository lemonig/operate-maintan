import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractConfigComponent } from './contract-config.component';

describe('ContractConfigComponent', () => {
  let component: ContractConfigComponent;
  let fixture: ComponentFixture<ContractConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

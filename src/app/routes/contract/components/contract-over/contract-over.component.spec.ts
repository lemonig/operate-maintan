import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractOverComponent } from './contract-over.component';

describe('ContractOverComponent', () => {
  let component: ContractOverComponent;
  let fixture: ComponentFixture<ContractOverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractOverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractOverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

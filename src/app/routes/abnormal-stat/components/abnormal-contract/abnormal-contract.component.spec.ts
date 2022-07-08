import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbnormalContractComponent } from './abnormal-contract.component';

describe('AbnormalContractComponent', () => {
  let component: AbnormalContractComponent;
  let fixture: ComponentFixture<AbnormalContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbnormalContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbnormalContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

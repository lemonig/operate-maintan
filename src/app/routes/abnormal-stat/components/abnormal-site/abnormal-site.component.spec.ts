import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbnormalSiteComponent } from './abnormal-site.component';

describe('AbnormalSiteComponent', () => {
  let component: AbnormalSiteComponent;
  let fixture: ComponentFixture<AbnormalSiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbnormalSiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbnormalSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

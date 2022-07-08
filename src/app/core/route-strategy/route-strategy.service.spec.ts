import { TestBed } from '@angular/core/testing';

import { RouteStrategyService } from './route-strategy.service';

describe('RouteStrategyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RouteStrategyService = TestBed.get(RouteStrategyService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { NgxNumberFormatService } from './ngx-number-format.service';

describe('NgxNumberFormatService', () => {
  beforeEach(() => TestBed.configureTestingModule({ teardown: { destroyAfterEach: false } }));

  it('should be created', () => {
    const service: NgxNumberFormatService = TestBed.get(NgxNumberFormatService);
    expect(service).toBeTruthy();
  });
});

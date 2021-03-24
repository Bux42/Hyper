import { TestBed } from '@angular/core/testing';

import { GoogleOauthService } from './google-oauth.service';

describe('GoogleOauthService', () => {
  let service: GoogleOauthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleOauthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

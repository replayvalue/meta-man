import { TestBed } from "@angular/core/testing";

import { MetaManService } from "./meta-man.service";

describe("MetaManService", () => {
  let service: MetaManService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetaManService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});

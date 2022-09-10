import { Test, TestingModule } from "@nestjs/testing";
import { RidersService } from "./riders.service";

describe("RidersService", () => {
  let service: RidersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RidersService]
    }).compile();

    service = module.get<RidersService>(RidersService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});

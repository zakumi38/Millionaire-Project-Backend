import { Test, TestingModule } from "@nestjs/testing";
import { RidersController } from "./riders.controller";
import { RidersService } from "./riders.service";

describe("RidersController", () => {
  let controller: RidersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RidersController],
      providers: [RidersService]
    }).compile();

    controller = module.get<RidersController>(RidersController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});

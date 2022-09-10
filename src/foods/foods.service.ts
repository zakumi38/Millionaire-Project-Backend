import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateFoodDto } from "./dto/create-food.dto";
import { UpdateFoodDto } from "./dto/update-food.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Food } from "./entities/food.entity";
import { Repository } from "typeorm";

@Injectable()
export class FoodsService {
    constructor(
      @InjectRepository(Food)
      private readonly foodRepository: Repository<Food>
    ) {
    }

    create(createFoodDto: CreateFoodDto) {
        const newRider = this.foodRepository.create({ ...createFoodDto });
        return this.foodRepository.save(newRider);
    }

    findAll() {
        return this.foodRepository.find({ order: { id: "ASC" } });
    }

    async findOne(id: number) {
        const food = await this.foodRepository.findOne({ where: { id } });
        if (!food) throw new NotFoundException(`Food #${id} cannot be found`);
        return food;
    }

    async update(id: number, updateFoodDto: UpdateFoodDto) {
        const food = await this.foodRepository.preload({
            id,
            ...updateFoodDto
        });
        if (!food)
            throw new NotFoundException(
              `Food #${id} cannot be updated because it doesn't exist`
            );
        return this.foodRepository.save(food);
    }

    async remove(id: number) {
        const food = await this.foodRepository.findOne({
            where: { id }
        });
        if (!food)
            throw new NotFoundException(
              `Food #${id} have already been deleted or doesn't exist`
            );
        return this.foodRepository.remove(food);
    }
}

import { Injectable, NotFoundException } from "@nestjs/common"
import { CreateRiderDto } from "./dto/create-rider.dto"
import { UpdateRiderDto } from "./dto/update-rider.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Rider } from "./entities/rider.entity"
import { Repository } from "typeorm"

@Injectable()
export class RidersService {
    constructor(
        @InjectRepository(Rider)
        private readonly riderRepository: Repository<Rider>
    ) {}

    create(createRiderDto: CreateRiderDto) {
        const newRider = this.riderRepository.create({ ...createRiderDto })
        return this.riderRepository.save(newRider)
    }

    findAll() {
        return this.riderRepository.find({ order: { id: "ASC" } })
    }

    async findOne(id: number) {
        const rider = await this.riderRepository.findOne({ where: { id } })
        if (!rider) throw new NotFoundException(`Rider #${id} cannot be found`)
        return rider
    }

    async update(id: number, updateRiderDto: UpdateRiderDto) {
        const rider = await this.riderRepository.preload({
            id,
            ...updateRiderDto,
        })
        if (!rider)
            throw new NotFoundException(
                `Rider #${id} cannot be updated because it doesn't exist`
            )
        return this.riderRepository.save(rider)
    }

    async remove(id: number) {
        const rider = await this.riderRepository.findOne({
            where: { id },
        })
        if (!rider)
            throw new NotFoundException(
                `Rider #${id} have already been deleted or doesn't exist`
            )
        return this.riderRepository.remove(rider)
    }
}

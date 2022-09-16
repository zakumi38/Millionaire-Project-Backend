import { Injectable, NotFoundException } from "@nestjs/common"
import { CreateRiderDto } from "./dto/create-rider.dto"
import { UpdateRiderDto } from "./dto/update-rider.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Rider } from "./entities/rider.entity"
import { Repository } from "typeorm"
import CommonService from "../common/common.service"

@Injectable()
export class RidersService {
    private readonly commonService: CommonService

    constructor(
        @InjectRepository(Rider)
        private readonly riderRepository: Repository<Rider>
    ) {
        this.commonService = new CommonService(riderRepository, "Rider")
    }

    create(createRiderDto: CreateRiderDto): Promise<Rider> {
        return this.commonService.create(createRiderDto)
    }

    findAll(): Promise<Rider[]> {
        return this.commonService.findAll("orders")
    }

    async findOne(id: number) {
        const rider = await this.riderRepository.findOne({
            where: { id },
            relations: ["orders"],
        })
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

    async remove(id: number): Promise<Rider> {
        return this.commonService.remove(id)
    }
}

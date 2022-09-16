import { Injectable } from "@nestjs/common"
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

    async findOne(id: number): Promise<Rider> {
        return this.commonService.findOne(id, "orders")
    }

    async update(id: number, updateRiderDto: UpdateRiderDto):Promise<Rider> {
        return this.commonService.update(id, updateRiderDto)
    }

    async remove(id: number): Promise<Rider> {
        return this.commonService.remove(id)
    }
}

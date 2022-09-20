import { Injectable } from "@nestjs/common"
import { CreateRiderDto } from "./dto/create-rider.dto"
import { UpdateRiderDto } from "./dto/update-rider.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Rider } from "./entities/rider.entity"
import { Repository } from "typeorm"
import CommonService from "../common/common.service"
import * as argon2 from "argon2"

@Injectable()
export class RidersService {
    private readonly commonService: CommonService

    constructor(
        @InjectRepository(Rider)
        private readonly riderRepository: Repository<Rider>
    ) {
        this.commonService = new CommonService(riderRepository, "Rider")
    }

    async create(createRiderDto: CreateRiderDto) {
        const hashPassword = await argon2.hash(createRiderDto.password)
        const createRiderDtoWtihHash = {
            ...createRiderDto,
            password: hashPassword,
        }
        const { password, ...otherCredentials } = await this.commonService
            .create(createRiderDtoWtihHash)
            .catch((err) => {
                throw new Error("Something Went Wrong")
            })
        return otherCredentials
    }

    findAll(): Promise<Rider[]> {
        return this.commonService.findAll("completedOrders")
    }

    async findOne(id: number) {
        return this.commonService.findOne(id, [
            "currentOrder",
            "completedOrders",
        ])
    }

    async update(id: number, updateRiderDto: UpdateRiderDto) {
        return this.commonService.update(id, updateRiderDto)
    }

    async remove(id: number) {
        return this.commonService.remove(id)
    }
    async findByEmail(email: string) {
        return this.commonService.findByEmail(email)
    }
    async findByToken(token: string, type: "accessToken" | "refreshToken") {
        return this.commonService.findByToken(token, type)
    }
}

import { FindOptionsOrderValue, Repository } from "typeorm"
import { Food } from "../foods/entities/food.entity"
import { Customer } from "../customers/entities/customer.entity"
import { Order } from "../orders/entities/order.entity"
import { Rider } from "../riders/entities/rider.entity"
import { Shop } from "../shops/entities/shop.entity"
import { NotFoundException } from "@nestjs/common"

type Entity = Customer | Food | Order | Rider | Shop
type UserEntity = Customer | Rider
export default class CommonService {
    // Inserts the repository of the entity
    private readonly repository: Repository<Entity>
    // The name of the entity for showing error messages
    private readonly entityName: string

    constructor(repository: Repository<Entity>, entityName: string) {
        this.repository = repository
        this.entityName = entityName
    }

    findAll(
        relations: string | string[],
        order: FindOptionsOrderValue = "ASC"
    ): Promise<any[]> {
        return this.repository.find({
            relations: typeof relations === "string" ? [relations] : relations,
            order: { id: order },
        })
    }

    async findOne(id: number, relations?: string | string[]): Promise<any> {
        const common = await this.repository.findOne({
            where: { id },
            relations: typeof relations === "string" ? [relations] : relations,
        })
        if (!common)
            throw new NotFoundException(
                `${this.entityName} #${id} cannot be found`
            )
        return common
    }

    create(createDto: any, otherDto?: object): Promise<any> {
        const newCommon = this.repository.create({
            ...createDto,
            ...otherDto,
        })
        return this.repository.save(newCommon)
    }

    /*
        Update the entities,
        second parameter is for the DTOs that need to be updated, can insert the whole DTOs or only the parts that need to be updated
     */
    async update(id: number, updateDto: any): Promise<any> {
        const common = await this.repository.preload({
            id,
            ...updateDto,
        })
        if (!common)
            throw new NotFoundException(
                `${this.entityName} #${id} cannot be updated because it doesn't exist`
            )
        return this.repository.save(common)
    }

    async remove(id: number): Promise<any> {
        const common = await this.repository.findOne({ where: { id } })
        if (!common)
            throw new NotFoundException(
                `${this.entityName} #${id} have already deleted or doesn't exist`
            )
        return this.repository.remove(common)
    }
    // Find By Email Method
    async findByEmail(email: string): Promise<UserEntity> {
        const user = await this.repository.findOne({ where: { email: email } })
        return user as UserEntity
    }
    async findByToken(
        token: string,
        type: "accessToken" | "refreshToken"
    ): Promise<UserEntity> {
        const user =
            type === "accessToken"
                ? await this.repository.findOne({
                      where: { accessToken: token },
                  })
                : await this.repository.findOne({
                      where: { refreshToken: token },
                  })
        return user as UserEntity
    }
}

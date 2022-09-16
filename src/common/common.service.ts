import { FindOptionsOrderValue, Repository } from "typeorm"
import { Food } from "../foods/entities/food.entity"
import { Customer } from "../customers/entities/customer.entity"
import { Order } from "../orders/entities/order.entity"
import { Rider } from "../riders/entities/rider.entity"
import { Shop } from "../shops/entities/shop.entity"
import { NotFoundException } from "@nestjs/common"

type Entities = Customer | Food | Order | Rider | Shop
export default class CommonService {
    // Inserts the repository of the entity
    private readonly repository: Repository<Entities>
    // The name of the entity for showing error messages
    private readonly entityName: string

    constructor(repository, entityName) {
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

    create(createDto, otherDto?: object): Promise<any> {
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
    async update(id: number, updateDto): Promise<any> {
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
}

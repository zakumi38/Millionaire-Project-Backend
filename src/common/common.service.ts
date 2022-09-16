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

    commonFindAll(
        relations: string | string[],
        order: FindOptionsOrderValue = "ASC"
    ): Promise<any[]> {
        return this.repository.find({
            relations: typeof relations === "string" ? [relations] : relations,
            order: { id: order },
        })
    }
}

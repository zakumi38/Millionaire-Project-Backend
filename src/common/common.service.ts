import { FindOptionsOrderValue, Repository } from "typeorm"
import { Food } from "../foods/entities/food.entity"
import { Customer } from "../customers/entities/customer.entity"
import { Order } from "../orders/entities/order.entity"
import { Rider } from "../riders/entities/rider.entity"
import { Shop } from "../shops/entities/shop.entity"

type CommonRepository = Repository<Customer | Food | Order | Rider | Shop>

export default class CommonService {
    // To be used in findAll methods
    static findAll(
        repository: CommonRepository,
        relations: string[],
        order: FindOptionsOrderValue = "ASC"
    ): Promise<any[]> {
        return repository.find({
            relations,
            order: { id: order },
        })
    }
}

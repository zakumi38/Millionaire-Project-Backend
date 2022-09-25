import { FindOptionsOrderValue, Repository } from "typeorm"
import { Food } from "../foods/entities/food.entity"
import { Customer } from "../customers/entities/customer.entity"
import { Order } from "../orders/entities/order.entity"
import { Rider } from "../riders/entities/rider.entity"
import { Shop } from "../shops/entities/shop.entity"
import { NotFoundException } from "@nestjs/common"
import { UpdateCustomerDto } from "../customers/dto/update-customer.dto"
import { UpdateFoodDto } from "../foods/dto/update-food.dto"
import { UpdateOrderDto } from "../orders/dto/update-order.dto"
import { UpdateRiderDto } from "../riders/dto/update-rider.dto"
import { UpdateShopDto } from "../shops/dto/update-shop.dto"

export type Entity = Customer | Food | Order | Rider | Shop
type UpdateDTOs =
    | UpdateCustomerDto
    | UpdateFoodDto
    | UpdateOrderDto
    | UpdateRiderDto
    | UpdateShopDto
type UserEntity = Customer | Rider
export default class CommonService {
    constructor(
        private repository: Repository<Entity>,
        private entityName: string
    ) {}

    /**
     * Find all the related items in the database
     * @param relations Relations of those items
     * @param order The order in which the items will be sorted
     */
    findAll(
        relations: string | string[],
        order: FindOptionsOrderValue = "ASC"
    ): Promise<any[]> {
        return this.repository.find({
            relations: typeof relations === "string" ? [relations] : relations,
            order: { id: order },
        })
    }

    /**
     * Find an item in the database
     * @param id Id of the item
     * @param relations Relations of that item
     */
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

    /**
     * Create an entity to the database
     * @param createDto Insert CreateDto
     * @param otherDto For the DTOs that are preloaded or modified before creating
     */
    create(createDto: any, otherDto?: object): Promise<any> {
        const newCommon = this.repository.create({
            ...createDto,
            ...otherDto,
        })
        return this.repository.save(newCommon)
    }

    /**
     * Update an entity from the database
     * @param id
     * @param updateDto The DTOs that are needed to be updated, can insert the whole DTOs or only the parts that need to be updated
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

    /**
     * Remove or delete an entity from the database
     * @param id
     */
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

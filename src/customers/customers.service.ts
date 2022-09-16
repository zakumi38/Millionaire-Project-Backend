import { Injectable, NotFoundException } from "@nestjs/common"
import { CreateCustomerDto } from "./dto/create-customer.dto"
import { UpdateCustomerDto } from "./dto/update-customer.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Customer } from "./entities/customer.entity"
import { Repository } from "typeorm"
import CommonService from "../common/common.service"

@Injectable()
export class CustomersService extends CommonService {
    constructor(
        @InjectRepository(Customer)
        private readonly customerRepository: Repository<Customer>
    ) {
        super(customerRepository, "Customer")
    }

    create(createCustomerDto: CreateCustomerDto) {
        const newCustomer = this.customerRepository.create({
            ...createCustomerDto,
        })
        return this.customerRepository.save(newCustomer)
    }

    findAll(): Promise<Customer[]> {
        return this.commonFindAll("orders")
    }

    async findOne(id: number) {
        const customer = await this.customerRepository.findOne({
            where: { id },
        })
        if (!customer)
            throw new NotFoundException(`Customer #${id} cannot be found`)
        return customer
    }

    async update(id: number, updateCustomerDto: UpdateCustomerDto) {
        const customer = await this.customerRepository.preload({
            id,
            ...updateCustomerDto,
        })
        if (!customer)
            throw new NotFoundException(`Customer #${id} cannot be found`)
        return this.customerRepository.save(customer)
    }

    async remove(id: number): Promise<Customer> {
        return this.commonRemove(id)
    }
}

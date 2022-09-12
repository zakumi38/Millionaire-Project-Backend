import { Injectable, NotFoundException } from "@nestjs/common"
import { CreateCustomerDto } from "./dto/create-customer.dto"
import { UpdateCustomerDto } from "./dto/update-customer.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Customer } from "./entities/customer.entity"
import { Repository } from "typeorm"

@Injectable()
export class CustomersService {
    constructor(
        @InjectRepository(Customer)
        private readonly customerRepository: Repository<Customer>
    ) {}

    create(createCustomerDto: CreateCustomerDto) {
        const newCustomer = this.customerRepository.create({
            ...createCustomerDto,
        })
        return this.customerRepository.save(newCustomer)
    }

    findAll() {
        return this.customerRepository.find({
            order: { id: "ASC" },
            relations: ["orders"],
        })
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

    async remove(id: number) {
        const customer = await this.customerRepository.findOne({
            where: { id },
        })
        if (!customer)
            throw new NotFoundException(
                `Customer #${id} have already been deleted or doesn't exist`
            )
        return this.customerRepository.remove(customer)
    }
}

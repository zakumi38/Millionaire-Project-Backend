import { Injectable, NotFoundException } from "@nestjs/common"
import { CreateCustomerDto } from "./dto/create-customer.dto"
import { UpdateCustomerDto } from "./dto/update-customer.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Customer } from "./entities/customer.entity"
import { Repository } from "typeorm"
import CommonService from "../common/common.service"

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
        return CommonService.findAll(this.customerRepository, ["orders"])
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

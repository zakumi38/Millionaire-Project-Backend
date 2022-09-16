import { Injectable } from "@nestjs/common"
import { CreateCustomerDto } from "./dto/create-customer.dto"
import { UpdateCustomerDto } from "./dto/update-customer.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Customer } from "./entities/customer.entity"
import { Repository } from "typeorm"
import CommonService from "../common/common.service"

@Injectable()
export class CustomersService {
    private readonly commonService: CommonService

    constructor(
        @InjectRepository(Customer)
        private readonly customerRepository: Repository<Customer>
    ) {
        this.commonService = new CommonService(customerRepository, "Customer")
    }

    create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
        return this.commonService.create(createCustomerDto)
    }

    findAll(): Promise<Customer[]> {
        return this.commonService.findAll("orders")
    }

    async findOne(id: number): Promise<Customer> {
        return this.commonService.findOne(id)
    }

    async update(
        id: number,
        updateCustomerDto: UpdateCustomerDto
    ): Promise<Customer> {
        return this.commonService.update(id, updateCustomerDto)
    }

    async remove(id: number): Promise<Customer> {
        return this.commonService.remove(id)
    }
}

import { PartialType } from "@nestjs/mapped-types"
import { CreateRiderDto } from "./create-rider.dto"

export class UpdateRiderDto extends PartialType(CreateRiderDto) {}

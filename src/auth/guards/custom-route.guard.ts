import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport/dist"
import { Request } from "express"
import { Observable } from "rxjs"
import { RidersService } from "src/riders/riders.service"

@Injectable()
export class RouteGuard extends AuthGuard("authentication") {
    constructor(private readonly riderService: RidersService) {
        super()
    }
    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request: Request = context.switchToHttp().getRequest()
        if (!request.cookies["refresh-token"]) return false
        return true
    }
}

import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport/dist"
import { Observable } from "rxjs"

@Injectable()
export class LocalGuard extends AuthGuard("authentication") {}

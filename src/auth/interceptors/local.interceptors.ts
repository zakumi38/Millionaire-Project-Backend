import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from "@nestjs/common"
import { map, Observable } from "rxjs"

export interface Response<T> {
    data: T
}
@Injectable()
export class ResponseWithCookie<T> implements NestInterceptor<T, Response<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Observable<Response<T>> {
        console.log(next.handle().pipe(map((val) => ({ val }))))
        return next.handle()
    }
}

import {
    Injectable,
    NestMiddleware,
    UnauthorizedException,
} from "@nestjs/common"
import { Request, Response, NextFunction } from "express"
import { AuthService } from "../auth.service"
import { RidersService } from "src/riders/riders.service"

@Injectable()
export class TokenMiddleware implements NestMiddleware {
    constructor(
        private readonly authService: AuthService,
        private readonly riderService: RidersService
    ) {}
    async use(req: Request, res: Response, next: NextFunction) {
        if (!req.cookies["access-token"] && req.cookies["refresh-token"]) {
            const { name, email, id, phoneNumber } =
                await this.riderService.findByToken(
                    res.cookie["refresh-token"],
                    "refreshToken"
                )
            const user = await this.authService.attachTokens(res, {
                name,
                email,
                id,
                phoneNumber,
            })
            res.json({ user })
        }
        next()
    }
}

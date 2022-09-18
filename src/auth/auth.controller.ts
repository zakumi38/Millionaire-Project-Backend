import {
    Controller,
    Get,
    Post,
    Req,
    Res,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common"
import { Response } from "express"
import { RidersService } from "src/riders/riders.service"
import { AuthService } from "./auth.service"
import { LocalGuard } from "./guards/local-strategy.guard"

@Controller()
export class AuthController {
    constructor(
        private readonly riderService: RidersService,
        private readonly authService: AuthService
    ) {}
    @UseGuards(LocalGuard)
    @Post("login")
    async login(@Req() request: Request & any, @Res() res: Response) {
        const { access_token, refresh_token, expiresAccess, expiresRefresh } =
            await this.authService.login(request.user)
        const config = {
            domain: "localhost",
            httpOnly: true,
        }
        res.cookie("access-token", access_token, {
            ...config,
            maxAge: expiresAccess,
        })
        res.cookie("refresh-token", refresh_token, {
            ...config,
            maxAge: expiresRefresh,
        })
        return res.send({ jwt: access_token })
    }
}

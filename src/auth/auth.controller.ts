import { Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common"
import { Response, Request } from "express"
import { AuthService } from "./auth.service"
import { LocalGuard } from "./guards/local-strategy.guard"
@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @UseGuards(LocalGuard)
    @Post("login")
    async login(@Req() request: Request & any, @Res() response: Response) {
        const user = await this.authService.attachTokens(response, request.user)
        return response.send({ user })
    }
}

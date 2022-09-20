import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { RidersService } from "src/riders/riders.service"
import { Response } from "express"

interface infos {
    name: string
    id: number
    phoneNumber: string
    email: string
}
@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly riderService: RidersService
    ) {}
    async login(user: any) {
        const payload = { username: user.email, sub: user.id }
        const current = new Date()
        const expiresAccess = new Date(current.getTime() + 86400000)
        const expiresRefresh = new Date(current.getTime() + 2592000000)
        return {
            access_token: this.jwtService.sign(payload, {
                secret: process.env.SECRET,
            }),
            expiresAccess,
            refresh_token: this.jwtService.sign(
                {
                    ...user,
                    randomID: Math.floor(Math.random() * 100 + 1) + 1,
                },
                {
                    secret: process.env.SECRET,
                }
            ),
            expiresRefresh,
            user,
        }
    }
    async attachTokens(res: Response, infos: infos) {
        const {
            access_token,
            refresh_token,
            expiresAccess,
            expiresRefresh,
            user,
        } = await this.login(infos)
        const config = {
            domain: "localhost",
            httpOnly: true,
        }
        res.cookie("access-token", access_token, {
            ...config,
            expires: expiresAccess,
        })
        res.cookie("refresh-token", refresh_token, {
            ...config,
            expires: expiresRefresh,
        })
        this.riderService.update(infos.id, {
            accessToken: access_token,
            refreshToken: refresh_token,
        })
        return user
    }
}

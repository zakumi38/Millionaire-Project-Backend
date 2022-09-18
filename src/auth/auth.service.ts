import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) {}
    async login(user: any) {
        const payload = { username: user.email, sub: user.id }
        const current = new Date()
        const expiresAccess = current.getTime() + 86400000
        const expiresRefresh = current.getTime() + 2592000000
        return {
            access_token: this.jwtService.sign(payload),
            expiresAccess,
            refresh_token: this.jwtService.sign({
                ...user,
                randomID: Math.floor(Math.random() * 100 + 1) + 1,
            }),
            expiresRefresh,
        }
    }
}

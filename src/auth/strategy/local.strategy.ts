import { Strategy } from "passport-local"
import { PassportStrategy } from "@nestjs/passport"
import { Injectable } from "@nestjs/common"
import * as argon2 from "argon2"
import { Observable } from "rxjs"

import { AuthService } from "../auth.service"
import { UnauthorizedException } from "@nestjs/common/exceptions"
import { RidersService } from "src/riders/riders.service"

type infos = {
    name: string
    email: string
    photoUrl: string | null
    previousPayments: any[] | null
}
@Injectable()
export class LocalStrategy extends PassportStrategy(
    Strategy,
    "authentication"
) {
    constructor(private riderService: RidersService) {
        super({ usernameField: "email" })
    }

    async validate(email: string, inputPassword: string): Promise<any> {
        const user = await this.riderService.findByEmail(email)
        if (!user) throw new UnauthorizedException()
        const verifier = await argon2.verify(user.password, inputPassword)
        if (!verifier) throw new UnauthorizedException()
        const { password, ...infos } = user
        return infos
    }
}

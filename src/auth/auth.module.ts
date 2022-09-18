import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { RidersModule } from "src/riders/riders.module"
import { AuthService } from "./auth.service"
import { JwtStrategy } from "./strategy/jwt.strategy"
import { LocalStrategy } from "./strategy/local.strategy"
import { AuthController } from "./auth.controller"
import { RidersService } from "src/riders/riders.service"

@Module({
    imports: [
        RidersModule,
        JwtModule.register({
            secret: "1234",
            verifyOptions: {
                ignoreExpiration: true,
            },
        }),
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    exports: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}

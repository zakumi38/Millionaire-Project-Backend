import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { RidersModule } from "src/riders/riders.module"
import { AuthService } from "./auth.service"
import { LocalStrategy } from "./strategy/local.strategy"
import { AuthController } from "./auth.controller"

@Module({
    imports: [
        RidersModule,
        JwtModule.register({
            secret: process.env.SECRET,
            verifyOptions: {
                ignoreExpiration: true,
            },
        }),
    ],
    providers: [AuthService, LocalStrategy],
    exports: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}

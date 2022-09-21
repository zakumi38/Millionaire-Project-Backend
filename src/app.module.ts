import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { RidersModule } from "./riders/riders.module"
import { FoodsModule } from "./foods/foods.module"
import { ShopsModule } from "./shops/shops.module"
import { CustomersModule } from "./customers/customers.module"
import { OrdersModule } from "./orders/orders.module"
import { AuthModule } from "./auth/auth.module"
import { TokenMiddleware } from "./auth/middlewares/token-attach.middleware"

@Module({
    imports: [
        ConfigModule.forRoot({ envFilePath: ".local.env" }),
        TypeOrmModule.forRoot({
            type: process.env.DB_TYPE as "postgres",
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            autoLoadEntities: true,
            synchronize: true,
        }),
        RidersModule,
        FoodsModule,
        ShopsModule,
        CustomersModule,
        OrdersModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(TokenMiddleware)
            .exclude("/login")
            .forRoutes(AppController)
    }
}

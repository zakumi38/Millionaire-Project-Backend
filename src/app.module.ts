import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RidersModule } from "./riders/riders.module";

@Module({
  imports: [TypeOrmModule.forRoot({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "root",
    database: "millionaire-project-backend",
    autoLoadEntities: true,
    synchronize: true
  }), RidersModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
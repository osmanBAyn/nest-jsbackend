import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DbService } from './db/db.service';
import { DbModule } from './db/db.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import {ConfigModule} from '@nestjs/config';
@Module({
  imports: [DbModule, UsersModule, AuthModule, ConfigModule.forRoot({
    isGlobal : true
  })],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

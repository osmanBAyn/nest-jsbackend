import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports : [DbModule],
  exports : [UsersService]
})
export class UsersModule {}

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { SessionSerializer } from './session.serializer';
import { GoogleStrategy } from './google.strategy';

@Module({
  providers: [AuthService, LocalStrategy, SessionSerializer, GoogleStrategy],
  imports : [UsersModule, PassportModule.register({session: true})],
  exports :[AuthService]
})
export class AuthModule {}

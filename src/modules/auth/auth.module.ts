import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './startegies/local.strategy';
import { JwtStrategy } from './startegies/jwt.strategy';
import { UserModule } from '../user/user.module';
import { NodemailerModule } from 'common/nodemailer/nodemailer.module';
import { NodeMailerService } from 'common/nodemailer/nodemailer.service';
@Module({
  imports: [
    PassportModule,
    NodemailerModule,
    UserModule,
    JwtModule.register({
      secret: 'abc123',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy  , NodeMailerService],
})
export class AuthModule {}

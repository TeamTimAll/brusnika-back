import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './startegies/local.strategy';
import { JwtStrategy } from './startegies/jwt.strategy';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports : [
    PassportModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret : "abc123",
      signOptions : { expiresIn : "1h"}
    })
  ],

  controllers: [AuthController],
  providers: [AuthService , LocalStrategy , JwtStrategy],
})


export class AuthModule {}

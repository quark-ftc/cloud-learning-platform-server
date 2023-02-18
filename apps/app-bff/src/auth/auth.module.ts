import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory } from '@nestjs/microservices';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '100d',
          },
        };
      },
    }),
  ],
  providers: [
    AuthService,
    {
      provide: 'microserviceUserClient',
      useFactory: (configService: ConfigService) => {
        const clientOption = configService.get(
          'microservice.microserviceUserClient',
        );
        return ClientProxyFactory.create(clientOption);
      },
      inject: [ConfigService],
    },
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { User } from '@prisma/client';
import { use } from 'passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwtStrategy') {
  constructor(
    @Inject('microserviceUserClient')
    private readonly microserviceUserClient: ClientProxy,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    try {
      const user = await firstValueFrom<Promise<User>>(
        this.microserviceUserClient.send('get:username', payload.username),
      );
      if (user) {
        delete user.password;
        return user;
      }
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }
}

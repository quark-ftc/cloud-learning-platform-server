import { registerAs } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
export default registerAs('microservice', () => {
  return {
    microserviceUserClient: {
      name: 'microserviceUserClient',
      transport: Transport.TCP,
      options: {
        port: 30000,
      },
    },
  };
});

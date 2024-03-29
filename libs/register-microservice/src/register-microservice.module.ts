import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'microserviceUserClient',
        transport: Transport.TCP,
        options: {
          port: 30000,
        },
      },
      {
        name: 'microserviceRoleClient',
        transport: Transport.TCP,
        options: {
          port: 30001,
        },
      },
      {
        name: 'microserviceCourseClient',
        transport: Transport.TCP,
        options: {
          port: 30002,
        },
      },
      {
        name: 'microserviceClassClient',
        transport: Transport.TCP,
        options: {
          port: 30003,
        },
      },
      {
        name: 'microserviceHomeworkClient',
        transport: Transport.TCP,
        options: {
          port: 30004,
        },
      },
      {
        name: 'microserviceSystemClient',
        transport: Transport.TCP,
        options: {
          port: 30005,
        },
      },
    ]),
  ],
  providers: [],
  exports: [ClientsModule],
})
export class RegisterMicroserviceModule {}

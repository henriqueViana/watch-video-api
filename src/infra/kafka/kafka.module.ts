import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { KafkaService } from './kafka.service'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'video-streaming',
            brokers: ['kafka:9092'],
          },
          consumer: {
            groupId: 'video-streaming-consumer',
          },
          producer: {
            allowAutoTopicCreation: true,
          },
        },
      }
    ])  
  ],
  providers: [KafkaService],
  exports: [KafkaService, ClientsModule]
})
export class KafkaModule {}
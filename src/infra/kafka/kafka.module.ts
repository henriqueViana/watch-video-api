import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { KafkaService } from './kafka.service'
import { KafkaConfig } from './kafka.config'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: KafkaConfig,
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
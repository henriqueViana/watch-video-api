import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { logger } from '../observability/logger';

@Injectable()
export class KafkaService implements OnModuleInit {
  constructor(@Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  async emit(topic: string, message) {
    try {
      await this.kafkaClient.emit(topic, message).toPromise();
    } catch (error) {
      logger.error(`Error sending message to topic ${topic}`, message, error);
    }
  }
}
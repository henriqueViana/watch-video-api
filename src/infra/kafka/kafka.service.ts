import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer, KafkaMessage } from 'kafkajs'
import { KafkaConfig } from './kafka.config';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka
  private producer: Producer

  async onModuleInit() {
    this.kafka = new Kafka(KafkaConfig)
    this.producer = this.kafka.producer()

    this.producer.connect()
      .then(() => console.log('Kafka producer connected'))
      .catch(err => console.error('Error connecting Kafka producer', err));
  }

  async emit(topic: string, message: KafkaMessage) {
    if (!this.producer) {
      throw new Error('Kafka producer is not initialized');
    }

    try {
      await this.producer.send({
        topic,
        messages: [message],
      });
      console.log(`Message sent to topic ${topic}`);
    } catch (error) {
      console.error(`Error sending message to topic ${topic}`, error);
    }
  }

  async onModuleDestroy() {
    await this.producer.disconnect()
    console.log('Kafka producer disconnected')
  }
}
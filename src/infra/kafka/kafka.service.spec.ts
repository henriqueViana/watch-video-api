import { KafkaService } from './kafka.service';
import { ClientKafka } from '@nestjs/microservices';
import { logger } from '../observability/logger';

jest.mock('../observability/logger', () => ({
  logger: {
    error: jest.fn(),
  },
}));

describe('KafkaService tests', () => {
  let service: KafkaService;
  let kafkaClient: ClientKafka;

  beforeEach(() => {
    kafkaClient = {
      connect: jest.fn(),
      emit: jest.fn(),
    } as unknown as ClientKafka;

    service = new KafkaService(kafkaClient);
  });

  describe('onModuleInit', () => {
    it('should connect the kafka client', async () => {
      (kafkaClient.connect as jest.Mock).mockResolvedValue(undefined);

      await service.onModuleInit();

      expect(kafkaClient.connect).toHaveBeenCalled();
    });
  });

  describe('emit', () => {
    it('should emit message to kafka topic', async () => {
      const topic = 'test-topic';
      const message = { key: 'value' };

      (kafkaClient.emit as jest.Mock).mockReturnValue({
        toPromise: jest.fn().mockResolvedValue(undefined),
      });

      await service.emit(topic, message);

      expect(kafkaClient.emit).toHaveBeenCalledWith(topic, message);
    });

    it('should log error when emit fails', async () => {
      const topic = 'test-topic';
      const message = { key: 'value' };
      const error = new Error('Kafka failure');

      (kafkaClient.emit as jest.Mock).mockReturnValue({
        toPromise: jest.fn().mockRejectedValue(error),
      });

      await service.emit(topic, message);

      expect(logger.error).toHaveBeenCalledWith(
        `Error sending message to topic ${topic}`,
        message,
        error
      );
    });
  });
});
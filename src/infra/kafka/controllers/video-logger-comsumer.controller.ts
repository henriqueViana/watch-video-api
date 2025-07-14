import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, KafkaContext } from '@nestjs/microservices';
import { trace, propagation, context } from '@opentelemetry/api';
import { MetricsService } from '../../../infra/observability/metrics/metrics.service';
import { logger } from 'src/infra/observability/logger';

@Controller()
export class VideoLoggerConsumer {
  constructor(private readonly metricsService: MetricsService) {}

  @MessagePattern('video-accessed')
  async handle(@Payload() payload: any, @Ctx() contextKafka: KafkaContext) {
    const headers = contextKafka.getMessage().headers;

    const parentContext = propagation.extract(context.active(), headers || {});
    const tracer = trace.getTracer('video-consumer');

    await tracer.startActiveSpan('video.log.save', { root: false }, parentContext, async (span) => {
      // TODO: Implementar lógica de persistência do log

      logger.info('video-accessed', payload);

      span.end();
    });
  }
}
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, KafkaContext } from '@nestjs/microservices';
import { trace, propagation, context } from '@opentelemetry/api';

@Controller()
export class VideoLoggerConsumer {
  constructor() {}

  @MessagePattern('video-accessed')
  async handle(@Payload() { value }: any, @Ctx() contextKafka: KafkaContext) {
    console.log('value:', value);

    const headers = contextKafka.getMessage().headers;

    console.log('headers:', headers);

    const parentContext = propagation.extract(context.active(), headers || {});
    const tracer = trace.getTracer('video-consumer');

    await tracer.startActiveSpan('video.log.save', { root: false }, parentContext, async (span) => {
      // TODO: Implementar lógica de persistência do log
      span.end();
    });
  }
}
import { Controller, Get, Inject, Query, Req, Res, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { trace, context, propagation } from '@opentelemetry/api';
import { ErrorInterceptor } from '../../common/interceptors/error.interceptor';
import { GetVideoDto } from '../../domain/dto/get-video.dto';
import { IGetVideoStreamUseCase } from '../../domain/application/use-case/get-video-stream-use-case.interface';
import { JwtAuthGuard } from '../../infra/auth/jwt-auth.guard';
import { logger } from '../../infra/observability/logger';
import { MetricsService } from '../../infra/observability/metrics/metrics.service';
import { ClientKafka } from '@nestjs/microservices';

@Controller()
export class VideoController {
  constructor(
    private readonly useCase: IGetVideoStreamUseCase,
    private readonly metricsService: MetricsService,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  @Get('/video')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ErrorInterceptor)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async getVideo(@Query() query: GetVideoDto, @Req() req, @Res() res) {
    const { userId } = req.user;
    const { filename } = query;

    // logger.info('video-accessed', { filename, userId });
    // this.metricsService.incrementAccess(filename);

    // console.log('antes kafka')
    // this.kafkaClient.emit('video-accessed', {
    //   key: userId,
    //   value: { filename, userId, timestamp: new Date().toISOString() },
    //   headers: {}, // inclui o traceparent!
    // });

    // console.log('depois kafka')
    
    const stream = await this.useCase.execute(filename);

    const tracer = trace.getTracer('video-stream');
    await tracer.startActiveSpan('video.access.log', async (span) => {
      const headers = {};

      // 🌐 2. Injeta contexto da span nos headers do Kafka
      propagation.inject(context.active(), headers);

      // 3. Envia para Kafka com trace nos headers
      this.kafkaClient.emit('video-accessed', {
        key: userId,
        value: { filename, userId, timestamp: new Date().toISOString() },
        headers, // inclui o traceparent!
      });

      span.end();
    });


    res.set({
      'Content-Type': 'video/mp4',
      'Content-Disposition': `inline; filename="${filename}"`,
    });

    stream.pipe(res);
  }
}

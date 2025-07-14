import { Controller, Get, Query, Req, Res, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { trace, context, propagation } from '@opentelemetry/api';
import { ErrorInterceptor } from '../../common/interceptors/error.interceptor';
import { GetVideoDto } from '../../domain/dto/get-video.dto';
import { IGetVideoStreamUseCase } from '../../domain/application/use-case/get-video-stream-use-case.interface';
import { JwtAuthGuard } from '../../infra/auth/jwt-auth.guard';
import { KafkaService } from '../../infra/kafka/kafka.service';
import { MetricsService } from '../../infra/observability/metrics/metrics.service';

@Controller()
export class VideoController {
  constructor(
    private readonly useCase: IGetVideoStreamUseCase,
    private readonly metricsService: MetricsService,
    private readonly kafkaClient: KafkaService,
  ) {}

  @Get('/video')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ErrorInterceptor)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async getVideo(@Query() query: GetVideoDto, @Req() req, @Res() res) {
    const { userId } = req.user;
    const { filename } = query;

    this.metricsService.incrementAccess(filename);
    const start = Date.now();

    const stream = await this.useCase.execute(filename);

    const tracer = trace.getTracer('video-stream');
    await tracer.startActiveSpan('video.access.log', async (span) => {
      const headers = {};

      propagation.inject(context.active(), headers);

      this.kafkaClient.emit('video-accessed', {
        key: userId,
        value: { filename, userId, timestamp: new Date().toISOString() },
        headers,
      });

      span.end();
    });

    res.set({
      'Content-Type': 'video/mp4',
      'Content-Disposition': `inline; filename="${filename}"`,
    });

    stream.pipe(res);

    this.metricsService.decrementActiveStreams();
    this.metricsService.observeDuration(filename, (Date.now() - start) / 1000);
  }
}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './infra/kafka/kafka.module';
import { ConfigModule } from '@nestjs/config';
import { S3Module } from './infra/s3/s3.module';
import { GetVideoStreamUseCase } from './application/use-case/get-video-stream.use-case';
import { VideoController } from './interfaces/controllers/video.controller';
import { ErrorMapperService } from './common/services/error-mapper.service';
import { ErrorInterceptor } from './common/interceptors/error.interceptor';
import { IGetVideoStreamUseCase } from './domain/application/use-case/get-video-stream-use-case.interface';
import { IErrorMapperService } from './common/services/error-mapper.interface';
import { AuthController } from './interfaces/controllers/auth.controller';
import { AuthModule } from './infra/auth/auth.module';
import { MetricsController } from './interfaces/controllers/metrics.controller';
import { MetricsService } from './infra/observability/metrics/metrics.service';
import { VideoLoggerConsumer } from './infra/kafka/controllers/video-logger-comsumer.controller';
import { FilenameNotFoundStrategy } from './common/errors/filename-not-found.strategy';
import { S3BucketNotFoundStrategy } from './common/errors/s3-bucket-not-found.strategy';
import { S3KeyNotFoundStrategy } from './common/errors';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    KafkaModule,
    S3Module,
    AuthModule
  ],
  controllers: [AppController, VideoController, AuthController, MetricsController, VideoLoggerConsumer],
  providers: [
    AppService, 
    {
      provide: IGetVideoStreamUseCase,
      useClass: GetVideoStreamUseCase 
    },
    {
      provide: IErrorMapperService,
      useClass: ErrorMapperService 
    },
    ErrorMapperService, 
    ErrorInterceptor,
    MetricsService,
    FilenameNotFoundStrategy,
    S3BucketNotFoundStrategy,
    S3KeyNotFoundStrategy
  ],
})
export class AppModule {}

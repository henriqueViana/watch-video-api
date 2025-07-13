import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './infra/kafka/kafka.module';
import { ConfigModule } from '@nestjs/config';
import { S3Module } from './infra/s3/s3.module';
import { GetVideoStreamUseCase } from './application/use-case/get-video-stream';
import { VideoController } from './interfaces/controllers/video.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    KafkaModule,
    S3Module
  ],
  controllers: [AppController, VideoController],
  providers: [AppService, GetVideoStreamUseCase],
})
export class AppModule {}

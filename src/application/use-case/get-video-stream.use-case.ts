import { Injectable } from '@nestjs/common';
import { IGetVideoStreamUseCase } from '../../domain/application/use-case/get-video-stream-use-case.interface';
import { S3Service } from '../../infra/s3/s3.service';
import { Readable } from 'stream';

@Injectable()
export class GetVideoStreamUseCase extends IGetVideoStreamUseCase {
  constructor(private readonly s3Service: S3Service) {
    super();
  }

  async execute(filename: string): Promise<Readable> {
    const video = await this.s3Service.getVideoStream(filename);
    return video as Readable;
  }
}
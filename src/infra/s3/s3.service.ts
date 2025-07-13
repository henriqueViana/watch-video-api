import { Injectable, PreconditionFailedException } from '@nestjs/common';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';
import { MulterS3File } from 'src/common/interfaces/multer-s3-file.interface';

@Injectable()
export class S3Service {
  private readonly bucket: string;
  private readonly s3: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.bucket = this.configService.get<string>('S3_BUCKET') || '';

    this.s3 = new S3Client({
      region: this.configService.get<string>('S3_REGION') || 'us-east-1',
      endpoint: this.configService.get<string>('S3_ENDPOINT') || 'http://localhost:4566',
      forcePathStyle: true,
      credentials: {
        accessKeyId: this.configService.get<string>('S3_ACCESS_KEY') || 'test',
        secretAccessKey: this.configService.get<string>('S3_SECRET_KEY') || 'test',
      },
    });
  }

  async getVideoStream(filename: string): Promise<Readable | null> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: filename,
    });

    try {
      const response = await this.s3.send(command);
      return response.Body as Readable;
    } catch (error) {
      throw error;
    }
  }

  async uploadVideo(file: MulterS3File) {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3.send(command);
    return { message: 'Upload realizado com sucesso', filename: file.originalname };
  }
}
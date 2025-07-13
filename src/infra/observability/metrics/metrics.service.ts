import { Injectable } from '@nestjs/common';
import * as client from 'prom-client';

@Injectable()
export class MetricsService {
  private videoAccessCounter = new client.Counter({
    name: 'video_stream_access_total',
    help: 'Total streams initialized by video',
    labelNames: ['filename'],
  });

  incrementAccess(filename: string) {
    this.videoAccessCounter.inc({ filename });
  }
}
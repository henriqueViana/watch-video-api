import { Injectable } from '@nestjs/common';
import * as client from 'prom-client';

@Injectable()
export class MetricsService {
  private videoAccessCounter = new client.Counter({
    name: 'video_stream_access_total',
    help: 'Total streams initialized by video',
    labelNames: ['filename'],
  });

  private videoErrorCounter = new client.Counter({
    name: 'video_stream_error_total',
    help: 'Total video stream errors',
    labelNames: ['filename', 'error_type'],
  });

  private videoDurationHistogram = new client.Histogram({
    name: 'video_stream_duration_seconds',
    help: 'Video stream processing time',
    labelNames: ['filename'],
    buckets: [0.5, 1, 2, 5, 10, 30, 60],  // em segundos
  });

  private videoActiveGauge = new client.Gauge({
    name: 'video_stream_active',
    help: 'Current active video streams',
  });

  incrementAccess(filename: string) {
    this.videoAccessCounter.inc({ filename });
  }

  decrementActiveStreams() {
    this.videoActiveGauge.dec();
  }

  recordError(filename: string, errorType: string) {
    this.videoErrorCounter.inc({ filename, error_type: errorType });
  }

  observeDuration(filename: string, durationSeconds: number) {
    this.videoDurationHistogram.observe({ filename }, durationSeconds);
  }
}
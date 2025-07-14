import { Injectable, NotFoundException } from "@nestjs/common";
import { ErrorStrategy } from "./error-strategy.interface";
import { MetricsService } from "../../infra/observability/metrics/metrics.service";
@Injectable()
export class S3KeyNotFoundStrategy implements ErrorStrategy {
  constructor(private readonly metricsService: MetricsService) {}
  supports(error: Error): boolean {
    return error?.name === 'NoSuchKey';
  }

  handle(_error: Error): NotFoundException {
    this.metricsService.recordError(JSON.stringify(_error || {}), 'NotFoundException');
    return new NotFoundException('Video with this key name not found');
  }
}
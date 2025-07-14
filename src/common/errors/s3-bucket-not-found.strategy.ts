import { Injectable, NotFoundException } from "@nestjs/common";
import { ErrorStrategy } from "./error-strategy.interface";
import { MetricsService } from "../../infra/observability/metrics/metrics.service";
@Injectable()
export class S3BucketNotFoundStrategy implements ErrorStrategy {
  constructor(private readonly metricsService: MetricsService) {}
  supports(error: any): boolean {
    return error?.name === 'NoSuchBucket';
  }

  handle(_error: any): NotFoundException {
    this.metricsService.recordError(JSON.stringify(_error || {}), 'NotFoundException');
    return new NotFoundException('S3 Bucket not found. Please check the bucket name and try again.');
  }
}
import { BadRequestException, Injectable } from "@nestjs/common";
import { ErrorStrategy } from "./error-strategy.interface";
import { MetricsService } from "../../infra/observability/metrics/metrics.service";
@Injectable()
export class FilenameNotFoundStrategy implements ErrorStrategy {
  constructor(private readonly metricsService: MetricsService) {}
  supports(error: any): boolean {
    return error?.response && error?.response?.statusCode === 400;
  }

  handle(error: any): BadRequestException {
    this.metricsService.recordError(JSON.stringify(error?.response || {}), 'BadRequestException');
    return new BadRequestException(error?.response || 'Query param filename is required');
  }
}
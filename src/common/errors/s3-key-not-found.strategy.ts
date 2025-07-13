import { NotFoundException } from "@nestjs/common";
import { ErrorStrategy } from "./error-strategy.interface";

export class S3KeyNotFoundStrategy implements ErrorStrategy {
  supports(error: Error): boolean {
    return error?.name === 'NoSuchKey';
  }

  handle(_error: Error): NotFoundException {
    return new NotFoundException('Video with this key name not found');
  }
}
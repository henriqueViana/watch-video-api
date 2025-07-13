import { NotFoundException } from "@nestjs/common";
import { ErrorStrategy } from "./error-strategy.interface";

export class S3BucketNotFoundStrategy implements ErrorStrategy {
  supports(error: any): boolean {
    return error?.name === 'NoSuchBucket';
  }

  handle(_error: any): NotFoundException {
    return new NotFoundException('S3 Bucket not found. Please check the bucket name and try again.');
  }
}
import { HttpException, Injectable } from "@nestjs/common";
import { ErrorStrategy } from "../errors/error-strategy.interface";
import { DefaultErrorStrategy } from "../errors/default.strategy";
import { IErrorMapperService } from "./error-mapper.interface";

import { 
  FilenameNotFoundStrategy, 
  S3BucketNotFoundStrategy,
  S3KeyNotFoundStrategy 
} from '../errors'

@Injectable()
export class ErrorMapperService extends IErrorMapperService {
  private errorMapper;
  constructor(
    private readonly filenameNotFoundStrategy: FilenameNotFoundStrategy,
    private readonly s3BucketNotFoundStrategy: S3BucketNotFoundStrategy,
    private readonly s3KeyNotFoundStrategy: S3KeyNotFoundStrategy,
  ) {
    super();
    this.errorMapper = {
      'BadRequestException': this.filenameNotFoundStrategy,
      'NoSuchBucket': this.s3BucketNotFoundStrategy,
      'NoSuchKey': this.s3KeyNotFoundStrategy,
    };
  }

  getStrategy(errorName: string): ErrorStrategy {
    return this.errorMapper[errorName];
  }

  map(error: Error): HttpException | undefined {
    const strategy = this.getStrategy(error.name)
    return strategy?.handle(error);
  }
}
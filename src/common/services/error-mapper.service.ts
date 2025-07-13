import { HttpException, Injectable } from "@nestjs/common";
import { ErrorStrategy } from "../errors/error-strategy.interface";
import { S3BucketNotFoundStrategy } from "../errors/s3-bucket-not-found.strategy";
import { S3KeyNotFoundStrategy } from "../errors/s3-key-not-found.strategy";
import { FilenameNotFoundStrategy } from "../errors/filename-not-found.strategy";
import { DefaultErrorStrategy } from "../errors/default.strategy";
import { IErrorMapperService } from "./error-mapper.interface";

@Injectable()
export class ErrorMapperService extends IErrorMapperService {
  private readonly strategies: ErrorStrategy[] = [
    new S3BucketNotFoundStrategy(),
    new S3KeyNotFoundStrategy(),
    new FilenameNotFoundStrategy(),
    new DefaultErrorStrategy(),
  ]

  map(error: Error): HttpException | undefined {
    const strategy = this.strategies.find((s) => s.supports(error));
    return strategy?.handle(error);
  }
}
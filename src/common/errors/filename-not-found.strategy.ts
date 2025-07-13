import { BadRequestException } from "@nestjs/common";
import { ErrorStrategy } from "./error-strategy.interface";

export class FilenameNotFoundStrategy implements ErrorStrategy {
  supports(error: any): boolean {
    return error?.response && error?.response?.statusCode === 400;
  }

  handle(error: any): BadRequestException {
    return new BadRequestException(error?.response || 'Query param filename is required');
  }
}
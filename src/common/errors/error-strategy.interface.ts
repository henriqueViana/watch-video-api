import { HttpException } from '@nestjs/common';

export interface ErrorStrategy {
  supports(error: any): boolean;
  handle(error: any): HttpException;
}
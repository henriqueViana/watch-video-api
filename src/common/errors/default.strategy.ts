import { ErrorStrategy } from './error-strategy.interface';
import { InternalServerErrorException } from '@nestjs/common';

export class DefaultErrorStrategy implements ErrorStrategy {
  supports(_error: Error): boolean {
    return true;
  }

  handle(error: Error): InternalServerErrorException {
    return new InternalServerErrorException(error.message || 'Erro interno');
  }
}
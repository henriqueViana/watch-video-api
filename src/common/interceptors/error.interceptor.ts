import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { catchError, throwError } from "rxjs";
import { IErrorMapperService } from "../services/error-mapper.interface";

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  constructor(private readonly errorMapper: IErrorMapperService) {}

  intercept(_context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      catchError(error => { 
        const exception = this.errorMapper.map(error);
        return throwError(() => exception);
      }),
    )
  }
}
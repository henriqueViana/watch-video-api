import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { catchError, throwError } from "rxjs";
import { ErrorMapperService } from "../services/error-mapper.service";

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  constructor(private readonly errorMapper: ErrorMapperService) {}

  intercept(_context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      catchError(error => { 
        console.log('errorrr', error?.response)
        const exception = this.errorMapper.map(error);
        return throwError(() => exception);
      }),
    )
  }
}
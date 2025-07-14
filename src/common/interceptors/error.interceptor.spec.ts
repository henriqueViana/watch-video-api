import { ErrorInterceptor } from './error.interceptor';
import { of, throwError } from 'rxjs';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { IErrorMapperService } from '../services/error-mapper.interface';

describe('ErrorInterceptor tests', () => {
  let interceptor: ErrorInterceptor;
  let errorMapper: IErrorMapperService;

  beforeEach(() => {
    errorMapper = {
      map: jest.fn(),
    };

    interceptor = new ErrorInterceptor(errorMapper);
  });

  it('should pass through if no error occurs', async () => {
    const context = {} as ExecutionContext;
    const handler: CallHandler = {
      handle: () => of('success'),
    };

    const result$ = interceptor.intercept(context, handler);

    await expect(result$.toPromise()).resolves.toBe('success');
  });

  it('should map and rethrow errors', async () => {
    const context = {} as ExecutionContext;
    const originalError = new Error('original error');
    const mappedError = new Error('mapped error');

    (errorMapper.map as jest.Mock).mockReturnValue(mappedError);

    const handler: CallHandler = {
      handle: () => throwError(() => originalError),
    };

    const result$ = interceptor.intercept(context, handler);

    await expect(result$.toPromise()).rejects.toThrow(mappedError);
    expect(errorMapper.map).toHaveBeenCalledWith(originalError);
  });
});
import { HttpException } from "@nestjs/common";

export abstract class IErrorMapperService {
  abstract map(error: any): HttpException | undefined;
}
import { Readable } from "stream";
import { DefaultUseCase } from "./default-use-case.interface";

export abstract class IGetVideoStreamUseCase extends DefaultUseCase<string, Readable> {
}
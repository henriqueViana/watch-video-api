export abstract class DefaultUseCase<Input, Output> {
  abstract execute(input: Input): Promise<Output>;
}
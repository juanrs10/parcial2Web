export enum BusinessError {
  NOT_FOUND = 'NOT_FOUND',
  PRECONDITION_FAILED = 'PRECONDITION_FAILED',
}

export class BusinessLogicException extends Error {
  constructor(
    message: string,
    public readonly type: BusinessError,
  ) {
    super(message);
  }
}

export class AppError extends Error {
  public readonly message: string;
  public readonly field: string;
  public readonly statusCode: number;

  constructor(field: string, message: string, statusCode = 400) {
    super(message);
    this.field = field;
    this.message = message;
    this.statusCode = statusCode;
  }
}

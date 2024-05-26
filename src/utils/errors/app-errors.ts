export class BaseError extends Error {
  statusCode?: number;

  constructor(
    name: string = "Error",
    statusCode?: number,
    description?: string
  ) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this);
  }
}

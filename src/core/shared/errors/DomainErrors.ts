export abstract class DomainError extends Error {
  public readonly details?: any;

  constructor(message: string, details?: any) {
    super(message);
    this.name = this.constructor.name;
    this.details = details;
  }
}

export class ValidationError extends DomainError {
  constructor(message: string, details?: any) {
    super(message, details);
  }
}

export class ConflictError extends DomainError {
  constructor(message: string, details?: any) {
    super(message, details);
  }
}

export class NotFoundError extends DomainError {
  constructor(message: string, details?: any) {
    super(message, details);
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message: string, details?: any) {
    super(message, details);
  }
}

export class DatabaseError extends DomainError {
  constructor(message: string, details?: any) {
    super(message, details);
  }
}
export type Failure<E> = {
  readonly isSuccess: false;
  readonly isFailure: true;
  readonly error: E;
};

export type Success<T> = {
  readonly isSuccess: true;
  readonly isFailure: false;
  readonly value: T;
};

export type Result<T, E = Error> = Success<T> | Failure<E>;

export function success<T>(value: T): Success<T> {
  return {
    isSuccess: true,
    isFailure: false,
    value,
  };
}

export function failure<E>(error: E): Failure<E> {
  return {
    isSuccess: false,
    isFailure: true,
    error,
  };
}

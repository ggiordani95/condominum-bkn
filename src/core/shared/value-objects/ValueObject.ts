export abstract class ValueObject<T> {
  protected readonly _value: T;

  constructor(value: T) {
    this._value = value;
  }

  public get value(): T {
    return this._value;
  }

  public equals(other: ValueObject<T>): boolean {
    if (!other) return false;
    return JSON.stringify(this._value) === JSON.stringify(other._value);
  }
}

import { ValueObject } from "../../../../core/shared/value-objects/ValueObject";

export class TimeLimit extends ValueObject<string> {
  constructor(time: string) {
    TimeLimit.validate(time);
    super(time);
  }

  private static validate(time: string): void {
    if (!time) {
      throw new Error("Time limit is required");
    }

    const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
    if (!timeRegex.test(time)) {
      throw new Error("Time limit must be in HH:MM format (00:00 to 23:59)");
    }
  }

  public static create(time: string): TimeLimit {
    return new TimeLimit(time);
  }

  public getHours(): number {
    const [hours] = this._value.split(":");
    return parseInt(hours, 10);
  }

  public getMinutes(): number {
    const [, minutes] = this._value.split(":");
    return parseInt(minutes, 10);
  }

  public isBeforeNow(): boolean {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();

    const limitHours = this.getHours();
    const limitMinutes = this.getMinutes();

    if (currentHours > limitHours) {
      return true;
    }

    if (currentHours === limitHours && currentMinutes > limitMinutes) {
      return true;
    }

    return false;
  }

  public applyToDate(date: Date): Date {
    const newDate = new Date(date);
    newDate.setHours(this.getHours(), this.getMinutes(), 0, 0);
    return newDate;
  }
}


import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserDto {
  @Expose()
  readonly uuid: string;

  @Expose()
  readonly firstName: string;
  @Expose()
  readonly lastName: string;

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @Expose()
  readonly email: string;
}

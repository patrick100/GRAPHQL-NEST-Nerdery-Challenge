import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserDto {
  @Expose()
  @ApiProperty({ description: 'uuid' })
  readonly uuid: string;

  @ApiProperty()
  @Expose()
  readonly firstName: string;

  @ApiProperty()
  @Expose()
  readonly lastName: string;

  @ApiProperty()
  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @ApiProperty()
  @Expose()
  readonly email: string;
}

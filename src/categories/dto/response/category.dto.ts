import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CategoryDto {
  @Expose()
  readonly uuid: string;

  @Expose()
  readonly name: string;

  @Expose()
  readonly description: string;

  @Expose()
  readonly isEnabled: boolean;
}

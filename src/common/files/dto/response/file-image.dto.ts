import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class FileImageDto {
  @Expose()
  readonly uuid: string;

  @Expose()
  readonly productId: string;

  @Expose()
  readonly key: string;

  @Expose()
  readonly url: string;
}

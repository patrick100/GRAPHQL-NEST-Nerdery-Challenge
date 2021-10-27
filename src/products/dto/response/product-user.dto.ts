import { OmitType } from '@nestjs/mapped-types';
import { ProductDto } from './product.dto';

export class ProductUserDto extends OmitType(ProductDto, [
  'measurementUnit',
  'stock',
  'isEnabled',
] as const) {}

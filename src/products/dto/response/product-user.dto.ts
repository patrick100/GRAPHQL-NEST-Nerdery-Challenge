import { OmitType } from '@nestjs/swagger';
import { ProductDto } from './product.dto';

export class ProductUserDto extends OmitType(ProductDto, [
  'measurementUnit',
  'stock',
  'isEnabled',
] as const) {}

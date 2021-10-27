import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class ModifyProductDto extends PartialType(CreateProductDto) {}
